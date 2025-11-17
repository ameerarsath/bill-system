package com.hotel.billing.services;

import com.hotel.billing.dto.BillDto;
import com.hotel.billing.dto.CreateBillRequest;
import com.hotel.billing.dto.OrderDto;
import com.hotel.billing.dto.PaymentDto;
import com.hotel.billing.exception.BadRequestException;
import com.hotel.billing.exception.ResourceNotFoundException;
import com.hotel.billing.models.*;
import com.hotel.billing.repositories.BillRepository;
import com.hotel.billing.repositories.OrderRepository;
import com.hotel.billing.repositories.PaymentRepository;
import com.hotel.billing.utils.QRCodeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderService orderService;
    private final QRCodeUtil qrCodeUtil;

    @Value("${app.invoice.base-url}")
    private String invoiceBaseUrl;

    @Value("${app.tax.default-percentage}")
    private BigDecimal defaultTaxPercentage;

    public List<BillDto> getAllBills() {
        return billRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public BillDto getBillById(Long id) {
        Bill bill = billRepository.findByIdWithPayments(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));
        return convertToDto(bill);
    }

    public BillDto getBillByNumber(String billNumber) {
        Bill bill = billRepository.findByBillNumber(billNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "billNumber", billNumber));
        return convertToDto(bill);
    }

    public BillDto getBillByQRToken(String qrToken) {
        Bill bill = billRepository.findByQrToken(qrToken)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "qrToken", qrToken));
        return convertToDto(bill);
    }

    public BillDto getBillByOrderId(Long orderId) {
        Bill bill = billRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "orderId", orderId));
        return convertToDto(bill);
    }

    public List<BillDto> getBillsByCustomerPhone(String phone) {
        return billRepository.findByCustomerPhone(phone).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BillDto> getBillsByPaymentStatus(String status) {
        PaymentStatus paymentStatus;
        try {
            paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid payment status: " + status);
        }

        return billRepository.findByPaymentStatus(paymentStatus).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BillDto createBill(CreateBillRequest request) {
        // Check if order exists
        Order order = orderRepository.findByIdWithItems(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        // Check if bill already exists for this order
        if (billRepository.findByOrderId(order.getId()).isPresent()) {
            throw new BadRequestException("Bill already exists for this order");
        }

        // Check if order is ready to be billed
        if (order.getStatus() != OrderStatus.READY && order.getStatus() != OrderStatus.SERVED) {
            throw new BadRequestException("Order must be READY or SERVED before billing");
        }

        // Calculate subtotal
        BigDecimal subtotal = order.getOrderItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get tax percentage (use provided or default)
        BigDecimal taxPercentage = request.getTaxPercentage() != null ?
                request.getTaxPercentage() : defaultTaxPercentage;

        // Calculate tax amount
        BigDecimal taxAmount = subtotal.multiply(taxPercentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        // Handle discount
        BigDecimal discountPercentage = request.getDiscountPercentage() != null ?
                request.getDiscountPercentage() : BigDecimal.ZERO;
        BigDecimal discountAmount = request.getDiscountAmount() != null ?
                request.getDiscountAmount() : BigDecimal.ZERO;

        // Calculate discount amount if percentage is provided
        if (discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
            discountAmount = subtotal.multiply(discountPercentage)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        // Calculate total
        BigDecimal totalAmount = subtotal.add(taxAmount).subtract(discountAmount);

        // Generate bill number and QR token
        String billNumber = generateBillNumber();
        String qrToken = qrCodeUtil.generateQRToken(billNumber);

        // Generate invoice URL
        String invoiceUrl = invoiceBaseUrl + "/" + qrToken;

        // Create bill
        Bill bill = Bill.builder()
                .billNumber(billNumber)
                .order(order)
                .customerPhone(request.getCustomerPhone())
                .subtotal(subtotal)
                .taxPercentage(taxPercentage)
                .taxAmount(taxAmount)
                .discountPercentage(discountPercentage)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .paymentStatus(PaymentStatus.PENDING)
                .qrToken(qrToken)
                .invoiceUrl(invoiceUrl)
                .payments(List.of())
                .build();

        bill = billRepository.save(bill);

        // Update order status to COMPLETED
        order.setStatus(OrderStatus.SERVED);
        order.setCustomerPhone(request.getCustomerPhone());
        orderRepository.save(order);

        return convertToDto(bill);
    }

    @Transactional
    public BillDto updateBill(Long id, CreateBillRequest request) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));

        if (bill.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Cannot update paid bill");
        }

        // Recalculate amounts
        BigDecimal subtotal = bill.getSubtotal();

        BigDecimal taxPercentage = request.getTaxPercentage() != null ?
                request.getTaxPercentage() : bill.getTaxPercentage();

        BigDecimal taxAmount = subtotal.multiply(taxPercentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        BigDecimal discountPercentage = request.getDiscountPercentage() != null ?
                request.getDiscountPercentage() : bill.getDiscountPercentage();
        BigDecimal discountAmount = request.getDiscountAmount() != null ?
                request.getDiscountAmount() : bill.getDiscountAmount();

        if (discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
            discountAmount = subtotal.multiply(discountPercentage)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        BigDecimal totalAmount = subtotal.add(taxAmount).subtract(discountAmount);

        bill.setCustomerPhone(request.getCustomerPhone());
        bill.setTaxPercentage(taxPercentage);
        bill.setTaxAmount(taxAmount);
        bill.setDiscountPercentage(discountPercentage);
        bill.setDiscountAmount(discountAmount);
        bill.setTotalAmount(totalAmount);

        bill = billRepository.save(bill);
        return convertToDto(bill);
    }

    private String generateBillNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "BILL" + timestamp;
    }

    private BillDto convertToDto(Bill bill) {
        // Get payments
        List<PaymentDto> payments = bill.getPayments().stream()
                .map(this::convertPaymentToDto)
                .collect(Collectors.toList());

        // Calculate paid and remaining amounts
        BigDecimal paidAmount = paymentRepository.getTotalPaidAmountForBill(bill.getId());
        if (paidAmount == null) {
            paidAmount = BigDecimal.ZERO;
        }
        BigDecimal remainingAmount = bill.getTotalAmount().subtract(paidAmount);

        // Get order details
        OrderDto orderDto = orderService.getOrderById(bill.getOrder().getId());

        // Generate QR code
        String qrCodeBase64 = null;
        if (bill.getInvoiceUrl() != null) {
            qrCodeBase64 = qrCodeUtil.generateInvoiceQRCode(bill.getInvoiceUrl());
        }

        return BillDto.builder()
                .id(bill.getId())
                .billNumber(bill.getBillNumber())
                .orderId(bill.getOrder().getId())
                .order(orderDto)
                .customerPhone(bill.getCustomerPhone())
                .subtotal(bill.getSubtotal())
                .taxPercentage(bill.getTaxPercentage())
                .taxAmount(bill.getTaxAmount())
                .discountPercentage(bill.getDiscountPercentage())
                .discountAmount(bill.getDiscountAmount())
                .totalAmount(bill.getTotalAmount())
                .paymentStatus(bill.getPaymentStatus().name())
                .qrToken(bill.getQrToken())
                .invoiceUrl(bill.getInvoiceUrl())
                .qrCodeBase64(qrCodeBase64)
                .payments(payments)
                .paidAmount(paidAmount)
                .remainingAmount(remainingAmount)
                .createdAt(bill.getCreatedAt())
                .build();
    }

    private PaymentDto convertPaymentToDto(Payment payment) {
        return PaymentDto.builder()
                .id(payment.getId())
                .billId(payment.getBill().getId())
                .paymentMethod(payment.getPaymentMethod().name())
                .amount(payment.getAmount())
                .transactionReference(payment.getTransactionReference())
                .processedBy(payment.getProcessedBy().getFullName())
                .paymentDate(payment.getPaymentDate())
                .notes(payment.getNotes())
                .build();
    }
}

package com.hotel.billing.services;

import com.hotel.billing.dto.CreatePaymentRequest;
import com.hotel.billing.dto.PaymentDto;
import com.hotel.billing.exception.BadRequestException;
import com.hotel.billing.exception.ResourceNotFoundException;
import com.hotel.billing.models.*;
import com.hotel.billing.repositories.BillRepository;
import com.hotel.billing.repositories.PaymentRepository;
import com.hotel.billing.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BillRepository billRepository;
    private final UserRepository userRepository;

    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<PaymentDto> getPaymentsByBillId(Long billId) {
        return paymentRepository.findByBillId(billId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        return convertToDto(payment);
    }

    @Transactional
    public PaymentDto createPayment(CreatePaymentRequest request, String username) {
        // Get bill
        Bill bill = billRepository.findByIdWithPayments(request.getBillId())
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", request.getBillId()));

        // Check if bill is already fully paid
        if (bill.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Bill is already fully paid");
        }

        // Validate payment method
        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid payment method: " + request.getPaymentMethod());
        }

        // Get current user (cashier)
        User processedBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Calculate total paid amount
        BigDecimal totalPaid = paymentRepository.getTotalPaidAmountForBill(bill.getId());
        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }

        BigDecimal newTotalPaid = totalPaid.add(request.getAmount());

        // Check if payment exceeds bill total
        if (newTotalPaid.compareTo(bill.getTotalAmount()) > 0) {
            throw new BadRequestException("Payment amount exceeds remaining bill amount");
        }

        // Create payment
        Payment payment = Payment.builder()
                .bill(bill)
                .paymentMethod(paymentMethod)
                .amount(request.getAmount())
                .transactionReference(request.getTransactionReference())
                .processedBy(processedBy)
                .paymentDate(LocalDateTime.now())
                .notes(request.getNotes())
                .build();

        payment = paymentRepository.save(payment);

        // Update bill payment status
        updateBillPaymentStatus(bill, newTotalPaid);

        return convertToDto(payment);
    }

    private void updateBillPaymentStatus(Bill bill, BigDecimal totalPaid) {
        if (totalPaid.compareTo(bill.getTotalAmount()) >= 0) {
            bill.setPaymentStatus(PaymentStatus.PAID);
            // Mark order as completed
            bill.getOrder().setStatus(OrderStatus.COMPLETED);
        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            bill.setPaymentStatus(PaymentStatus.PARTIAL);
        }
        billRepository.save(bill);
    }

    public BigDecimal getTotalPaidAmount(Long billId) {
        BigDecimal total = paymentRepository.getTotalPaidAmountForBill(billId);
        return total != null ? total : BigDecimal.ZERO;
    }

    private PaymentDto convertToDto(Payment payment) {
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

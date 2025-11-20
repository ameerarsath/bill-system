package com.hotel.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillDto {
    private Long id;
    private String billNumber;
    private Long orderId;
    private OrderDto order;
    private String customerPhone;
    private BigDecimal subtotal;
    private BigDecimal taxPercentage;
    private BigDecimal taxAmount;
    private BigDecimal discountPercentage;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String paymentStatus; // PENDING, PARTIAL, PAID
    private String qrToken;
    private String invoiceUrl;
    private String qrCodeBase64;
    private List<PaymentDto> payments;
    private BigDecimal paidAmount;
    private BigDecimal remainingAmount;
    private LocalDateTime createdAt;
}

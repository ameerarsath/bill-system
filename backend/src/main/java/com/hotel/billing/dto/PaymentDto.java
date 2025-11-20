package com.hotel.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private Long id;
    private Long billId;
    private String paymentMethod; // CASH, UPI, CARD, WALLET, CREDIT
    private BigDecimal amount;
    private String transactionReference;
    private String processedBy;
    private LocalDateTime paymentDate;
    private String notes;
}

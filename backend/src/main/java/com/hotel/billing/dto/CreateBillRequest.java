package com.hotel.billing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBillRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    private String customerPhone;

    private BigDecimal taxPercentage; // Optional, uses default if not provided

    private BigDecimal discountPercentage; // Optional discount

    private BigDecimal discountAmount; // Optional flat discount
}

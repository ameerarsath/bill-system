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
public class OrderDto {
    private Long id;
    private String orderNumber;
    private Long tableId;
    private String tableNumber;
    private String orderType; // DINE_IN, PARCEL, TAKEAWAY
    private String status; // PENDING, COOKING, READY, SERVED, COMPLETED, CANCELLED
    private String createdBy;
    private String customerPhone;
    private String specialInstructions;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

package com.hotel.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KitchenOrderDto {
    private Long orderId;
    private String orderNumber;
    private String tableNumber;
    private String orderType;
    private String specialInstructions;
    private List<KitchenItemDto> items;
    private LocalDateTime createdAt;
}

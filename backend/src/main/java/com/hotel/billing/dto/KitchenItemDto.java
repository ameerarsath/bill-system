package com.hotel.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KitchenItemDto {
    private Long itemId;
    private String itemName;
    private Integer quantity;
    private String status; // PENDING, COOKING, READY
    private String specialNotes;
    private Boolean isVeg;
}

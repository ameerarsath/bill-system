package com.hotel.billing.dto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderRequest {

    @Valid
    private List<OrderItemRequest> items;

    private String specialInstructions;

    private String customerPhone;
}

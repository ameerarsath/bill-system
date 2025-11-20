package com.hotel.billing.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    private Long tableId; // null for PARCEL/TAKEAWAY

    @NotNull(message = "Order type is required")
    private String orderType; // DINE_IN, PARCEL, TAKEAWAY

    @NotEmpty(message = "Order must have at least one item")
    @Valid
    private List<OrderItemRequest> items;

    private String specialInstructions;
}

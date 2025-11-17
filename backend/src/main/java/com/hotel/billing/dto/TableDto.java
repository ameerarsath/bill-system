package com.hotel.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableDto {
    private Long id;
    private String tableNumber;
    private Integer capacity;
    private String status; // FREE, OCCUPIED, RESERVED
}

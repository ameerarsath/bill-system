package com.hotel.billing.services;

import com.hotel.billing.dto.CreateTableRequest;
import com.hotel.billing.dto.TableDto;
import com.hotel.billing.exception.BadRequestException;
import com.hotel.billing.exception.ResourceNotFoundException;
import com.hotel.billing.models.RestaurantTable;
import com.hotel.billing.models.TableStatus;
import com.hotel.billing.repositories.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableService {

    private final RestaurantTableRepository tableRepository;

    public List<TableDto> getAllTables() {
        return tableRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TableDto> getTablesByStatus(String status) {
        TableStatus tableStatus;
        try {
            tableStatus = TableStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid table status: " + status);
        }

        return tableRepository.findByStatus(tableStatus).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TableDto getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table", "id", id));
        return convertToDto(table);
    }

    @Transactional
    public TableDto createTable(CreateTableRequest request) {
        if (tableRepository.existsByTableNumber(request.getTableNumber())) {
            throw new BadRequestException("Table with number '" + request.getTableNumber() + "' already exists");
        }

        RestaurantTable table = RestaurantTable.builder()
                .tableNumber(request.getTableNumber())
                .capacity(request.getCapacity())
                .status(TableStatus.FREE)
                .build();

        table = tableRepository.save(table);
        return convertToDto(table);
    }

    @Transactional
    public TableDto updateTable(Long id, CreateTableRequest request) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table", "id", id));

        if (!table.getTableNumber().equals(request.getTableNumber()) &&
                tableRepository.existsByTableNumber(request.getTableNumber())) {
            throw new BadRequestException("Table with number '" + request.getTableNumber() + "' already exists");
        }

        table.setTableNumber(request.getTableNumber());
        table.setCapacity(request.getCapacity());

        table = tableRepository.save(table);
        return convertToDto(table);
    }

    @Transactional
    public void deleteTable(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table", "id", id));

        if (table.getStatus() == TableStatus.OCCUPIED) {
            throw new BadRequestException("Cannot delete occupied table");
        }

        tableRepository.delete(table);
    }

    @Transactional
    public TableDto updateTableStatus(Long id, String status) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table", "id", id));

        TableStatus tableStatus;
        try {
            tableStatus = TableStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid table status: " + status);
        }

        table.setStatus(tableStatus);
        table = tableRepository.save(table);
        return convertToDto(table);
    }

    private TableDto convertToDto(RestaurantTable table) {
        return TableDto.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .capacity(table.getCapacity())
                .status(table.getStatus().name())
                .build();
    }
}

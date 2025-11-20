package com.hotel.billing.controllers;

import com.hotel.billing.dto.CreateTableRequest;
import com.hotel.billing.dto.TableDto;
import com.hotel.billing.services.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @GetMapping
    public ResponseEntity<List<TableDto>> getAllTables() {
        List<TableDto> tables = tableService.getAllTables();
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TableDto>> getTablesByStatus(@PathVariable String status) {
        List<TableDto> tables = tableService.getTablesByStatus(status);
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableDto> getTableById(@PathVariable Long id) {
        TableDto table = tableService.getTableById(id);
        return ResponseEntity.ok(table);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TableDto> createTable(@Valid @RequestBody CreateTableRequest request) {
        TableDto table = tableService.createTable(request);
        return new ResponseEntity<>(table, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TableDto> updateTable(
            @PathVariable Long id,
            @Valid @RequestBody CreateTableRequest request) {
        TableDto table = tableService.updateTable(id, request);
        return ResponseEntity.ok(table);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT')")
    public ResponseEntity<TableDto> updateTableStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        TableDto table = tableService.updateTableStatus(id, status);
        return ResponseEntity.ok(table);
    }
}

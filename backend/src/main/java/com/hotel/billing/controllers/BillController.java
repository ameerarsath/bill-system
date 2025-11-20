package com.hotel.billing.controllers;

import com.hotel.billing.dto.BillDto;
import com.hotel.billing.dto.CreateBillRequest;
import com.hotel.billing.services.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillingService billingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'SERVANT')")
    public ResponseEntity<List<BillDto>> getAllBills() {
        List<BillDto> bills = billingService.getAllBills();
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'SERVANT')")
    public ResponseEntity<BillDto> getBillById(@PathVariable Long id) {
        BillDto bill = billingService.getBillById(id);
        return ResponseEntity.ok(bill);
    }

    @GetMapping("/number/{billNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'SERVANT')")
    public ResponseEntity<BillDto> getBillByNumber(@PathVariable String billNumber) {
        BillDto bill = billingService.getBillByNumber(billNumber);
        return ResponseEntity.ok(bill);
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'SERVANT')")
    public ResponseEntity<BillDto> getBillByOrderId(@PathVariable Long orderId) {
        BillDto bill = billingService.getBillByOrderId(orderId);
        return ResponseEntity.ok(bill);
    }

    @GetMapping("/phone/{phone}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'SERVANT')")
    public ResponseEntity<List<BillDto>> getBillsByCustomerPhone(@PathVariable String phone) {
        List<BillDto> bills = billingService.getBillsByCustomerPhone(phone);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    public ResponseEntity<List<BillDto>> getBillsByPaymentStatus(@PathVariable String status) {
        List<BillDto> bills = billingService.getBillsByPaymentStatus(status);
        return ResponseEntity.ok(bills);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT')")
    public ResponseEntity<BillDto> createBill(@Valid @RequestBody CreateBillRequest request) {
        BillDto bill = billingService.createBill(request);
        return new ResponseEntity<>(bill, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    public ResponseEntity<BillDto> updateBill(
            @PathVariable Long id,
            @Valid @RequestBody CreateBillRequest request) {
        BillDto bill = billingService.updateBill(id, request);
        return ResponseEntity.ok(bill);
    }
}

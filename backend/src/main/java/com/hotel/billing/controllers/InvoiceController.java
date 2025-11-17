package com.hotel.billing.controllers;

import com.hotel.billing.dto.BillDto;
import com.hotel.billing.services.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public invoice endpoint accessible via QR code
 */
@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoiceController {

    private final BillingService billingService;

    @GetMapping("/{qrToken}")
    public ResponseEntity<BillDto> getInvoiceByToken(@PathVariable String qrToken) {
        BillDto bill = billingService.getBillByQRToken(qrToken);
        return ResponseEntity.ok(bill);
    }
}

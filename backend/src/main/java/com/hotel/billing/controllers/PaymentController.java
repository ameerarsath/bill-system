package com.hotel.billing.controllers;

import com.hotel.billing.dto.CreatePaymentRequest;
import com.hotel.billing.dto.PaymentDto;
import com.hotel.billing.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PaymentDto>> getAllPayments() {
        List<PaymentDto> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable Long id) {
        PaymentDto payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/bill/{billId}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByBillId(@PathVariable Long billId) {
        List<PaymentDto> payments = paymentService.getPaymentsByBillId(billId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/bill/{billId}/total")
    public ResponseEntity<BigDecimal> getTotalPaidAmount(@PathVariable Long billId) {
        BigDecimal total = paymentService.getTotalPaidAmount(billId);
        return ResponseEntity.ok(total);
    }

    @PostMapping
    public ResponseEntity<PaymentDto> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        PaymentDto payment = paymentService.createPayment(request, username);
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }
}

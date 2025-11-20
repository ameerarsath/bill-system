package com.hotel.billing.controllers;

import com.hotel.billing.dto.CreateOrderRequest;
import com.hotel.billing.dto.OrderDto;
import com.hotel.billing.dto.UpdateOrderRequest;
import com.hotel.billing.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT', 'KITCHEN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT', 'KITCHEN')")
    public ResponseEntity<List<OrderDto>> getActiveOrders() {
        List<OrderDto> orders = orderService.getActiveOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT', 'KITCHEN')")
    public ResponseEntity<List<OrderDto>> getOrdersByStatus(@PathVariable String status) {
        List<OrderDto> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT', 'KITCHEN', 'CASHIER')")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/number/{orderNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT', 'KITCHEN', 'CASHIER')")
    public ResponseEntity<OrderDto> getOrderByNumber(@PathVariable String orderNumber) {
        OrderDto order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(order);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT')")
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OrderDto order = orderService.createOrder(request, username);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT')")
    public ResponseEntity<OrderDto> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderRequest request) {
        OrderDto order = orderService.updateOrder(id, request);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT', 'KITCHEN')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        OrderDto order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/phone")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT')")
    public ResponseEntity<OrderDto> addCustomerPhone(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        OrderDto order = orderService.addCustomerPhone(id, phone);
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT')")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/daily-count")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT')")
    public ResponseEntity<Long> getDailyOrderCount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long count = orderService.getDailyOrderCountByUser(username);
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{orderId}/items/{itemId}/delivered")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVANT')")
    public ResponseEntity<OrderDto> markItemAsDelivered(
            @PathVariable Long orderId,
            @PathVariable Long itemId) {
        OrderDto order = orderService.markItemAsDelivered(orderId, itemId);
        return ResponseEntity.ok(order);
    }
}

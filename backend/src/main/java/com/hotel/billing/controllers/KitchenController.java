package com.hotel.billing.controllers;

import com.hotel.billing.dto.KitchenItemDto;
import com.hotel.billing.dto.KitchenOrderDto;
import com.hotel.billing.services.KitchenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kitchen")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('KITCHEN', 'ADMIN')")
public class KitchenController {

    private final KitchenService kitchenService;

    @GetMapping("/orders")
    public ResponseEntity<List<KitchenOrderDto>> getKitchenOrders() {
        List<KitchenOrderDto> orders = kitchenService.getKitchenOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/pending")
    public ResponseEntity<List<KitchenOrderDto>> getPendingOrders() {
        List<KitchenOrderDto> orders = kitchenService.getPendingOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/cooking")
    public ResponseEntity<List<KitchenOrderDto>> getCookingOrders() {
        List<KitchenOrderDto> orders = kitchenService.getCookingOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/ready")
    public ResponseEntity<List<KitchenOrderDto>> getReadyOrders() {
        List<KitchenOrderDto> orders = kitchenService.getReadyOrders();
        return ResponseEntity.ok(orders);
    }

    @PatchMapping("/items/{itemId}/status")
    public ResponseEntity<KitchenItemDto> updateItemStatus(
            @PathVariable Long itemId,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        KitchenItemDto item = kitchenService.updateItemStatus(itemId, status);
        return ResponseEntity.ok(item);
    }

    @PatchMapping("/items/{itemId}/cooking")
    public ResponseEntity<KitchenItemDto> startCooking(@PathVariable Long itemId) {
        KitchenItemDto item = kitchenService.startCooking(itemId);
        return ResponseEntity.ok(item);
    }

    @PatchMapping("/items/{itemId}/ready")
    public ResponseEntity<KitchenItemDto> markItemReady(@PathVariable Long itemId) {
        KitchenItemDto item = kitchenService.markItemReady(itemId);
        return ResponseEntity.ok(item);
    }

    @PatchMapping("/orders/{orderId}/cooking")
    public ResponseEntity<KitchenOrderDto> startCookingOrder(@PathVariable Long orderId) {
        KitchenOrderDto order = kitchenService.startCookingOrder(orderId);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/orders/{orderId}/ready")
    public ResponseEntity<KitchenOrderDto> markOrderReady(@PathVariable Long orderId) {
        KitchenOrderDto order = kitchenService.markOrderReady(orderId);
        return ResponseEntity.ok(order);
    }
}

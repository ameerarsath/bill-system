package com.hotel.billing.services;

import com.hotel.billing.dto.KitchenItemDto;
import com.hotel.billing.dto.KitchenOrderDto;
import com.hotel.billing.exception.BadRequestException;
import com.hotel.billing.exception.ResourceNotFoundException;
import com.hotel.billing.models.*;
import com.hotel.billing.repositories.OrderItemRepository;
import com.hotel.billing.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KitchenService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    /**
     * Get all orders that need kitchen attention (PENDING, COOKING, READY)
     */
    public List<KitchenOrderDto> getKitchenOrders() {
        List<OrderStatus> kitchenStatuses = List.of(
                OrderStatus.PENDING,
                OrderStatus.COOKING,
                OrderStatus.READY
        );

        return orderRepository.findByStatusIn(kitchenStatuses).stream()
                .map(this::convertToKitchenOrderDto)
                .collect(Collectors.toList());
    }

    /**
     * Get pending orders (newly placed orders)
     */
    public List<KitchenOrderDto> getPendingOrders() {
        return orderRepository.findByStatus(OrderStatus.PENDING).stream()
                .map(this::convertToKitchenOrderDto)
                .collect(Collectors.toList());
    }

    /**
     * Get orders currently being cooked
     */
    public List<KitchenOrderDto> getCookingOrders() {
        return orderRepository.findByStatus(OrderStatus.COOKING).stream()
                .map(this::convertToKitchenOrderDto)
                .collect(Collectors.toList());
    }

    /**
     * Get ready orders (waiting to be served)
     */
    public List<KitchenOrderDto> getReadyOrders() {
        return orderRepository.findByStatus(OrderStatus.READY).stream()
                .map(this::convertToKitchenOrderDto)
                .collect(Collectors.toList());
    }

    /**
     * Update item status in kitchen (PENDING -> COOKING -> READY)
     */
    @Transactional
    public KitchenItemDto updateItemStatus(Long itemId, String status) {
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem", "id", itemId));

        ItemStatus newStatus;
        try {
            newStatus = ItemStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid item status: " + status);
        }

        orderItem.setItemStatus(newStatus);
        orderItem = orderItemRepository.save(orderItem);

        // Update order status based on item statuses
        updateOrderStatusBasedOnItems(orderItem.getOrder());

        return convertToKitchenItemDto(orderItem);
    }

    /**
     * Mark item as cooking
     */
    @Transactional
    public KitchenItemDto startCooking(Long itemId) {
        return updateItemStatus(itemId, "COOKING");
    }

    /**
     * Mark item as ready
     */
    @Transactional
    public KitchenItemDto markItemReady(Long itemId) {
        return updateItemStatus(itemId, "READY");
    }

    /**
     * Mark all items in an order as cooking
     */
    @Transactional
    public KitchenOrderDto startCookingOrder(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.getOrderItems().forEach(item -> {
            if (item.getItemStatus() == ItemStatus.PENDING) {
                item.setItemStatus(ItemStatus.COOKING);
            }
        });

        order.setStatus(OrderStatus.COOKING);
        order = orderRepository.save(order);
        return convertToKitchenOrderDto(order);
    }

    /**
     * Mark all items in an order as ready
     */
    @Transactional
    public KitchenOrderDto markOrderReady(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.getOrderItems().forEach(item -> {
            if (item.getItemStatus() != ItemStatus.READY) {
                item.setItemStatus(ItemStatus.READY);
            }
        });

        order.setStatus(OrderStatus.READY);
        order = orderRepository.save(order);
        return convertToKitchenOrderDto(order);
    }

    /**
     * Helper method to update order status based on individual item statuses
     */
    private void updateOrderStatusBasedOnItems(Order order) {
        List<OrderItem> items = order.getOrderItems();

        if (items.isEmpty()) {
            return;
        }

        boolean allReady = items.stream().allMatch(item -> item.getItemStatus() == ItemStatus.READY);
        boolean anyCooking = items.stream().anyMatch(item -> item.getItemStatus() == ItemStatus.COOKING);
        boolean allPending = items.stream().allMatch(item -> item.getItemStatus() == ItemStatus.PENDING);

        if (allReady) {
            order.setStatus(OrderStatus.READY);
        } else if (anyCooking || !allPending) {
            order.setStatus(OrderStatus.COOKING);
        } else {
            order.setStatus(OrderStatus.PENDING);
        }

        orderRepository.save(order);
    }

    private KitchenOrderDto convertToKitchenOrderDto(Order order) {
        List<KitchenItemDto> items = order.getOrderItems().stream()
                .map(this::convertToKitchenItemDto)
                .collect(Collectors.toList());

        return KitchenOrderDto.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .tableNumber(order.getTable() != null ? order.getTable().getTableNumber() : order.getOrderType().name())
                .orderType(order.getOrderType().name())
                .specialInstructions(order.getSpecialInstructions())
                .items(items)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private KitchenItemDto convertToKitchenItemDto(OrderItem item) {
        return KitchenItemDto.builder()
                .itemId(item.getId())
                .itemName(item.getMenuItem().getName())
                .quantity(item.getQuantity())
                .status(item.getItemStatus().name())
                .specialNotes(item.getSpecialNotes())
                .isVeg(item.getMenuItem().getIsVeg())
                .build();
    }
}

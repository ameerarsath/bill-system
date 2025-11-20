package com.hotel.billing.services;

import com.hotel.billing.dto.*;
import com.hotel.billing.exception.BadRequestException;
import com.hotel.billing.exception.ResourceNotFoundException;
import com.hotel.billing.models.*;
import com.hotel.billing.repositories.*;
import com.hotel.billing.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final UserRepository userRepository;
    private final CustomUserDetailsService userDetailsService;

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByStatus(String status) {
        OrderStatus orderStatus;
        try {
            orderStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }

        return orderRepository.findByStatus(orderStatus).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<OrderDto> getActiveOrders() {
        List<OrderStatus> activeStatuses = List.of(
                OrderStatus.PENDING,
                OrderStatus.COOKING,
                OrderStatus.READY,
                OrderStatus.SERVED
        );
        return orderRepository.findByStatusIn(activeStatuses).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return convertToDto(order);
    }

    public OrderDto getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return convertToDto(order);
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request, String username) {
        // Validate order type
        OrderType orderType;
        try {
            orderType = OrderType.valueOf(request.getOrderType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order type: " + request.getOrderType());
        }

        // Validate table for DINE_IN orders
        RestaurantTable table = null;
        if (orderType == OrderType.DINE_IN) {
            if (request.getTableId() == null) {
                throw new BadRequestException("Table is required for dine-in orders");
            }
            table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Table", "id", request.getTableId()));

            // Update table status to OCCUPIED
            table.setStatus(TableStatus.OCCUPIED);
            tableRepository.save(table);
        }

        // Get current user
        User createdBy = userDetailsService.loadUserEntityByUsername(username);

        // Generate order number
        String orderNumber = generateOrderNumber();

        // Create order
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .table(table)
                .orderType(orderType)
                .status(OrderStatus.PENDING)
                .createdBy(createdBy)
                .specialInstructions(request.getSpecialInstructions())
                .orderItems(new ArrayList<>())
                .build();

        order = orderRepository.save(order);

        // Add order items
        for (OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemRequest.getMenuItemId()));

            if (!menuItem.getAvailable()) {
                throw new BadRequestException("Menu item '" + menuItem.getName() + "' is not available");
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .itemStatus(ItemStatus.PENDING)
                    .specialNotes(itemRequest.getSpecialNotes())
                    .build();

            order.getOrderItems().add(orderItem);
        }

        order = orderRepository.save(order);
        return convertToDto(order);
    }

    @Transactional
    public OrderDto updateOrder(Long id, UpdateOrderRequest request) {
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Cannot update order that has been sent to kitchen");
        }

        // Update customer phone if provided
        if (request.getCustomerPhone() != null) {
            order.setCustomerPhone(request.getCustomerPhone());
        }

        // Update special instructions
        if (request.getSpecialInstructions() != null) {
            order.setSpecialInstructions(request.getSpecialInstructions());
        }

        // Update items if provided
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            // Clear existing items
            order.getOrderItems().clear();
            orderRepository.save(order);

            // Add new items
            for (OrderItemRequest itemRequest : request.getItems()) {
                MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemRequest.getMenuItemId()));

                if (!menuItem.getAvailable()) {
                    throw new BadRequestException("Menu item '" + menuItem.getName() + "' is not available");
                }

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .menuItem(menuItem)
                        .quantity(itemRequest.getQuantity())
                        .unitPrice(menuItem.getPrice())
                        .itemStatus(ItemStatus.PENDING)
                        .specialNotes(itemRequest.getSpecialNotes())
                        .build();

                order.getOrderItems().add(orderItem);
            }
        }

        order = orderRepository.save(order);
        return convertToDto(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }

        order.setStatus(newStatus);

        // If order is completed or cancelled, free the table
        if ((newStatus == OrderStatus.COMPLETED || newStatus == OrderStatus.CANCELLED) &&
                order.getTable() != null) {
            order.getTable().setStatus(TableStatus.FREE);
            tableRepository.save(order.getTable());
        }

        order = orderRepository.save(order);
        return convertToDto(order);
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel completed order");
        }

        order.setStatus(OrderStatus.CANCELLED);

        // Free the table if it was dine-in
        if (order.getTable() != null) {
            order.getTable().setStatus(TableStatus.FREE);
            tableRepository.save(order.getTable());
        }

        orderRepository.save(order);
    }

    @Transactional
    public OrderDto addCustomerPhone(Long id, String phone) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        order.setCustomerPhone(phone);
        order = orderRepository.save(order);
        return convertToDto(order);
    }

    public Long getDailyOrderCountByUser(String username) {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        return orderRepository.countByCreatedByUsernameAndCreatedAtAfter(username, todayStart);
    }

    @Transactional
    public OrderDto markItemAsDelivered(Long orderId, Long itemId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem", "id", itemId));

        // Note: Currently returning order as-is.
        // To track delivery status, add a 'delivered' boolean field to OrderItem model
        // and update it here: orderItem.setDelivered(true);

        order = orderRepository.save(order);
        return convertToDto(order);
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "ORD" + timestamp;
    }

    private OrderDto convertToDto(Order order) {
        List<OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(this::convertItemToDto)
                .collect(Collectors.toList());

        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .tableId(order.getTable() != null ? order.getTable().getId() : null)
                .tableNumber(order.getTable() != null ? order.getTable().getTableNumber() : null)
                .orderType(order.getOrderType().name())
                .status(order.getStatus().name())
                .createdBy(order.getCreatedBy().getFullName())
                .customerPhone(order.getCustomerPhone())
                .specialInstructions(order.getSpecialInstructions())
                .items(itemDtos)
                .totalAmount(totalAmount)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemDto convertItemToDto(OrderItem item) {
        BigDecimal totalPrice = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderItemDto.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem().getId())
                .menuItemName(item.getMenuItem().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(totalPrice)
                .itemStatus(item.getItemStatus().name())
                .specialNotes(item.getSpecialNotes())
                .isVeg(item.getMenuItem().getIsVeg())
                .build();
    }
}

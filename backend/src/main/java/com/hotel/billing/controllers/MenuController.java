package com.hotel.billing.controllers;

import com.hotel.billing.dto.CreateMenuItemRequest;
import com.hotel.billing.dto.MenuItemDto;
import com.hotel.billing.services.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems() {
        List<MenuItemDto> menuItems = menuService.getAllMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/available")
    public ResponseEntity<List<MenuItemDto>> getAvailableMenuItems() {
        List<MenuItemDto> menuItems = menuService.getAvailableMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<MenuItemDto>> getMenuItemsByCategory(@PathVariable Long categoryId) {
        List<MenuItemDto> menuItems = menuService.getMenuItemsByCategory(categoryId);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/category/{categoryId}/available")
    public ResponseEntity<List<MenuItemDto>> getAvailableMenuItemsByCategory(@PathVariable Long categoryId) {
        List<MenuItemDto> menuItems = menuService.getAvailableMenuItemsByCategory(categoryId);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long id) {
        MenuItemDto menuItem = menuService.getMenuItemById(id);
        return ResponseEntity.ok(menuItem);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> createMenuItem(@Valid @RequestBody CreateMenuItemRequest request) {
        MenuItemDto menuItem = menuService.createMenuItem(request);
        return new ResponseEntity<>(menuItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody CreateMenuItemRequest request) {
        MenuItemDto menuItem = menuService.updateMenuItem(id, request);
        return ResponseEntity.ok(menuItem);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> toggleMenuItemAvailability(@PathVariable Long id) {
        MenuItemDto menuItem = menuService.toggleMenuItemAvailability(id);
        return ResponseEntity.ok(menuItem);
    }
}

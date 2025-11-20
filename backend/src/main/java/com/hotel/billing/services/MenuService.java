package com.hotel.billing.services;

import com.hotel.billing.dto.CreateMenuItemRequest;
import com.hotel.billing.dto.MenuItemDto;
import com.hotel.billing.exception.BadRequestException;
import com.hotel.billing.exception.ResourceNotFoundException;
import com.hotel.billing.models.Category;
import com.hotel.billing.models.MenuItem;
import com.hotel.billing.repositories.CategoryRepository;
import com.hotel.billing.repositories.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;

    public List<MenuItemDto> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MenuItemDto> getAvailableMenuItems() {
        return menuItemRepository.findAllAvailableMenuItems().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MenuItemDto> getMenuItemsByCategory(Long categoryId) {
        return menuItemRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MenuItemDto> getAvailableMenuItemsByCategory(Long categoryId) {
        return menuItemRepository.findAvailableMenuItemsByCategory(categoryId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public MenuItemDto getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
        return convertToDto(menuItem);
    }

    @Transactional
    public MenuItemDto createMenuItem(CreateMenuItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        MenuItem menuItem = MenuItem.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .isVeg(request.getIsVeg())
                .available(request.getAvailable())
                .imageUrl(request.getImageUrl())
                .build();

        menuItem = menuItemRepository.save(menuItem);
        return convertToDto(menuItem);
    }

    @Transactional
    public MenuItemDto updateMenuItem(Long id, CreateMenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        menuItem.setCategory(category);
        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setIsVeg(request.getIsVeg());
        menuItem.setAvailable(request.getAvailable());
        menuItem.setImageUrl(request.getImageUrl());

        menuItem = menuItemRepository.save(menuItem);
        return convertToDto(menuItem);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));

        menuItemRepository.delete(menuItem);
    }

    @Transactional
    public MenuItemDto toggleMenuItemAvailability(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));

        menuItem.setAvailable(!menuItem.getAvailable());
        menuItem = menuItemRepository.save(menuItem);
        return convertToDto(menuItem);
    }

    private MenuItemDto convertToDto(MenuItem menuItem) {
        return MenuItemDto.builder()
                .id(menuItem.getId())
                .categoryId(menuItem.getCategory().getId())
                .categoryName(menuItem.getCategory().getName())
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .isVeg(menuItem.getIsVeg())
                .available(menuItem.getAvailable())
                .imageUrl(menuItem.getImageUrl())
                .build();
    }
}

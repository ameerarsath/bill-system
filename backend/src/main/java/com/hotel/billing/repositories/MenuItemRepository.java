package com.hotel.billing.repositories;

import com.hotel.billing.models.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByCategoryId(Long categoryId);

    List<MenuItem> findByAvailableTrue();

    List<MenuItem> findByCategoryIdAndAvailableTrue(Long categoryId);

    @Query("SELECT m FROM MenuItem m WHERE m.category.id = :categoryId AND m.available = true ORDER BY m.name")
    List<MenuItem> findAvailableMenuItemsByCategory(Long categoryId);

    @Query("SELECT m FROM MenuItem m WHERE m.available = true ORDER BY m.category.name, m.name")
    List<MenuItem> findAllAvailableMenuItems();
}

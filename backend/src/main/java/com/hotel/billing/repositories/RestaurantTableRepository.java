package com.hotel.billing.repositories;

import com.hotel.billing.models.RestaurantTable;
import com.hotel.billing.models.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

    Optional<RestaurantTable> findByTableNumber(String tableNumber);

    List<RestaurantTable> findByStatus(TableStatus status);

    boolean existsByTableNumber(String tableNumber);
}

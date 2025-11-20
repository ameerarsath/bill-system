package com.hotel.billing.repositories;

import com.hotel.billing.models.ItemStatus;
import com.hotel.billing.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByItemStatus(ItemStatus itemStatus);

    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.order o WHERE oi.itemStatus = :status ORDER BY oi.createdAt ASC")
    List<OrderItem> findByItemStatusWithOrder(@Param("status") ItemStatus status);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId AND oi.itemStatus = :status")
    List<OrderItem> findByOrderIdAndStatus(@Param("orderId") Long orderId,
                                            @Param("status") ItemStatus status);
}

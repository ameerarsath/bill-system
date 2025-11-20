package com.hotel.billing.repositories;

import com.hotel.billing.models.Payment;
import com.hotel.billing.models.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBillId(Long billId);

    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.bill.id = :billId")
    BigDecimal getTotalPaidAmountForBill(@Param("billId") Long billId);

    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate ORDER BY p.paymentDate DESC")
    List<Payment> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);
}

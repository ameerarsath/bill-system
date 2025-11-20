package com.hotel.billing.repositories;

import com.hotel.billing.models.Bill;
import com.hotel.billing.models.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    Optional<Bill> findByBillNumber(String billNumber);

    Optional<Bill> findByQrToken(String qrToken);

    Optional<Bill> findByOrderId(Long orderId);

    List<Bill> findByCustomerPhone(String customerPhone);

    List<Bill> findByPaymentStatus(PaymentStatus paymentStatus);

    @Query("SELECT b FROM Bill b WHERE b.createdAt BETWEEN :startDate AND :endDate ORDER BY b.createdAt DESC")
    List<Bill> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM Bill b LEFT JOIN FETCH b.payments WHERE b.id = :billId")
    Optional<Bill> findByIdWithPayments(@Param("billId") Long billId);
}

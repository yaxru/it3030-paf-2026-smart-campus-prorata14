// Member 02 - Booking Engine & Logic: Booking JPA repository with conflict detection query
package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(String userId);

    // Conflict check: APPROVED bookings that overlap with the given time window
    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
            "AND b.status = 'APPROVED' " +
            "AND :newStart < b.endTime AND :newEnd > b.startTime")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("newStart") LocalDateTime newStart,
            @Param("newEnd") LocalDateTime newEnd);

    // Admin view with optional status filter
    @Query("SELECT b FROM Booking b WHERE (:status IS NULL OR b.status = :status)")
    List<Booking> findByStatusOptional(@Param("status") Booking.BookingStatus status);
}

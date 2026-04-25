// Member 02 - Booking Engine & Logic: Booking JPA entity
package com.sliit.smartcampus.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long resourceId;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    private String purpose;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    private String adminReason; // reason when approved/rejected

    public enum BookingStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}

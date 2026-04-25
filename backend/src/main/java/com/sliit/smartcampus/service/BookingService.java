// Member 02 - Booking Engine & Logic: Booking service with conflict detection
package com.sliit.smartcampus.service;

import com.sliit.smartcampus.entity.Booking;
import com.sliit.smartcampus.entity.Notification;
import com.sliit.smartcampus.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    /**
     * Member 02: Returns true if the proposed booking conflicts with an existing
     * APPROVED booking for the same resource.
     * Conflict condition: (newStart < existingEnd) AND (newEnd > existingStart)
     */
    public boolean checkConflict(Long resourceId, java.time.LocalDateTime newStart, java.time.LocalDateTime newEnd) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(resourceId, newStart, newEnd);
        return !conflicts.isEmpty();
    }

    public Booking createBooking(Booking booking) {
        if (booking.getStartTime().isAfter(booking.getEndTime()) ||
                booking.getStartTime().isEqual(booking.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time.");
        }
        if (checkConflict(booking.getResourceId(), booking.getStartTime(), booking.getEndTime())) {
            throw new IllegalArgumentException("This time slot conflicts with an existing approved booking.");
        }
        booking.setStatus(Booking.BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings(Booking.BookingStatus status) {
        return bookingRepository.findByStatusOptional(status);
    }

    public Booking updateStatus(Long id, Booking.BookingStatus status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
        booking.setStatus(status);
        booking.setAdminReason(reason);
        Booking saved = bookingRepository.save(booking);

        // Notify user of status change
        String message = "Your booking #" + id + " has been " + status.name().toLowerCase() +
                (reason != null && !reason.isBlank() ? ". Reason: " + reason : ".");
        notificationService.sendNotification(booking.getUserId(), message);

        return saved;
    }
}

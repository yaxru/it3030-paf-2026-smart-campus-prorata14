// Member 02 - Booking Engine & Logic: Booking REST controller
package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.entity.Booking;
import com.sliit.smartcampus.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // POST /api/bookings — request a booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        booking.setUserId(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(booking));
    }

    // GET /api/bookings/my — user's own bookings
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(bookingService.getMyBookings(email));
    }

    // GET /api/bookings/all?status=PENDING — admin view
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) Booking.BookingStatus status) {
        return ResponseEntity.ok(bookingService.getAllBookings(status));
    }

    // PUT /api/bookings/{id}/status — admin approve/reject
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Booking.BookingStatus status = Booking.BookingStatus.valueOf(body.get("status"));
        String reason = body.get("reason");
        return ResponseEntity.ok(bookingService.updateStatus(id, status, reason));
    }
}

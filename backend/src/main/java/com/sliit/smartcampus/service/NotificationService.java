// Member 03 - Incident Ticketing & Notifications: Notification service
package com.sliit.smartcampus.service;

import com.sliit.smartcampus.entity.Notification;
import com.sliit.smartcampus.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Member 03: Send a notification to a user.
     * Called whenever a Booking is Approved/Rejected or an Incident status changes.
     */
    public Notification sendNotification(String userId, String message) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Notification not found: " + id));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}

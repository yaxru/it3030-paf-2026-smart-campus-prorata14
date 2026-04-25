// Member 03 - Incident Ticketing & Notifications: Incident JPA entity
package com.sliit.smartcampus.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long resourceId;

    @Column(nullable = false)
    private String reportedBy; // user email

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status;

    private String assignedTo; // technician email

    // Up to 3 image URLs
    @ElementCollection
    @CollectionTable(name = "incident_images", joinColumns = @JoinColumn(name = "incident_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    // Embedded comments
    @ElementCollection
    @CollectionTable(name = "incident_comments", joinColumns = @JoinColumn(name = "incident_id"))
    private List<IncidentComment> comments = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null)
            status = IncidentStatus.OPEN;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Priority {
        LOW, HIGH
    }

    public enum IncidentStatus {
        OPEN, IN_PROGRESS, RESOLVED
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IncidentComment {
        private String author; // email
        private String message;
        private LocalDateTime postedAt;
    }
}

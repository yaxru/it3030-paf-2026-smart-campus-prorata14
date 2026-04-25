// Member 03 - Incident Ticketing & Notifications: Incident service layer
package com.sliit.smartcampus.service;

import com.sliit.smartcampus.entity.Incident;
import com.sliit.smartcampus.repository.IncidentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final NotificationService notificationService;

    public Incident createIncident(Incident incident) {
        if (incident.getImageUrls() != null && incident.getImageUrls().size() > 3) {
            throw new IllegalArgumentException("A maximum of 3 image URLs are allowed per incident.");
        }
        return incidentRepository.save(incident);
    }

    // Admin / USER view — all incidents with optional filters
    public List<Incident> getIncidents(Incident.IncidentStatus status, Incident.Priority priority) {
        return incidentRepository.findByStatusAndPriority(status, priority);
    }

    // TECHNICIAN view — only incidents assigned to this technician
    public List<Incident> getIncidentsForTechnician(
            String technicianEmail, Incident.IncidentStatus status, Incident.Priority priority) {
        return incidentRepository.findByAssignedToAndFilters(technicianEmail, status, priority);
    }

    // USER view — only incidents reported by this user
    public List<Incident> getIncidentsForUser(
            String userEmail, Incident.IncidentStatus status, Incident.Priority priority) {
        return incidentRepository.findByReportedByAndFilters(userEmail, status, priority);
    }

    public Incident assignTechnician(Long id, String technicianEmail) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Incident not found with id: " + id));
        incident.setAssignedTo(technicianEmail);
        incident.setStatus(Incident.IncidentStatus.IN_PROGRESS);
        Incident saved = incidentRepository.save(incident);

        // Notify reporter that incident is being handled
        notificationService.sendNotification(
                incident.getReportedBy(),
                "Your incident #" + id + " has been assigned to " + technicianEmail + " and is now IN_PROGRESS.");
        return saved;
    }

    public Incident addComment(Long id, String author, String message) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Incident not found with id: " + id));
        Incident.IncidentComment comment = new Incident.IncidentComment(author, message, LocalDateTime.now());
        incident.getComments().add(comment);
        return incidentRepository.save(incident);
    }
}

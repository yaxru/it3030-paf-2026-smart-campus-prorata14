// Member 03 - Incident Ticketing & Notifications: Incident REST controller
package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.entity.Incident;
import com.sliit.smartcampus.service.IncidentService;
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
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    // POST /api/incidents — create a ticket
    @PostMapping
    public ResponseEntity<Incident> createIncident(
            @RequestBody Incident incident,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        incident.setReportedBy(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(incidentService.createIncident(incident));
    }

    // GET /api/incidents?status=OPEN&priority=HIGH
    // - TECHNICIAN: sees only their assigned incidents
    // - USER: sees only their own reported incidents
    // - ADMIN: sees all incidents
    @GetMapping
    public ResponseEntity<List<Incident>> getIncidents(
            @RequestParam(required = false) Incident.IncidentStatus status,
            @RequestParam(required = false) Incident.Priority priority,
            @AuthenticationPrincipal OAuth2User principal) {

        String email = principal.getAttribute("email");

        boolean isTechnician = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICIAN"));
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isTechnician) {
            return ResponseEntity.ok(incidentService.getIncidentsForTechnician(email, status, priority));
        }
        if (isAdmin) {
            return ResponseEntity.ok(incidentService.getIncidents(status, priority));
        }
        // Regular USER — only their own tickets
        return ResponseEntity.ok(incidentService.getIncidentsForUser(email, status, priority));
    }

    // PUT /api/incidents/{id}/assign — assign technician (Admin)
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Incident> assignTechnician(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String technicianEmail = body.get("technicianEmail");
        return ResponseEntity.ok(incidentService.assignTechnician(id, technicianEmail));
    }

    // POST /api/incidents/{id}/comments — add a comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<Incident> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal OAuth2User principal) {
        String author = principal.getAttribute("email");
        String message = body.get("message");
        return ResponseEntity.ok(incidentService.addComment(id, author, message));
    }
}

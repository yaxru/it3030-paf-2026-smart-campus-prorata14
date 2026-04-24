// Member 01 - Facilities & Security: Admin user management controller
package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.entity.UserProfile;
import com.sliit.smartcampus.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileRepository userProfileRepository;

    // GET /api/admin/users — list all registered users (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfile>> getAllUsers() {
        return ResponseEntity.ok(userProfileRepository.findAll());
    }

    // GET /api/admin/users/technicians — list all technicians (Admin only)
    @GetMapping("/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfile>> getTechnicians() {
        return ResponseEntity.ok(userProfileRepository.findByRole(UserProfile.Role.TECHNICIAN));
    }

    // PUT /api/admin/users/{email}/role — change a user's role (Admin only)
    // Body: { "role": "TECHNICIAN" }
    @PutMapping("/{email}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> updateRole(
            @PathVariable String email,
            @RequestBody Map<String, String> body) {

        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + email));

        UserProfile.Role newRole = UserProfile.Role.valueOf(body.get("role").toUpperCase());
        profile.setRole(newRole);
        return ResponseEntity.ok(userProfileRepository.save(profile));
    }
}

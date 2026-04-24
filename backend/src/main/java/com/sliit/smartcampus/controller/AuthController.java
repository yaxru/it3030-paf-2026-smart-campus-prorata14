// Member 01 - Facilities & Security: Auth controller exposing current user info from DB
package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.entity.UserProfile;
import com.sliit.smartcampus.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserProfileRepository userProfileRepository;

    // GET /api/auth/me — returns the logged-in user's profile with DB role
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @AuthenticationPrincipal OAuth2User principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String email = principal.getAttribute("email");

        // Fetch role from DB (authoritative source)
        String role = userProfileRepository.findByEmail(email)
                .map(p -> p.getRole().name())
                .orElse("USER");

        return ResponseEntity.ok(Map.of(
                "name",    principal.getAttribute("name"),
                "email",   email,
                "picture", principal.getAttribute("picture") != null
                           ? principal.getAttribute("picture") : "",
                "role",    role
        ));
    }
}

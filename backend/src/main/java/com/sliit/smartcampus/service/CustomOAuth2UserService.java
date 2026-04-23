// Member 01 - Facilities & Security: Custom OAuth2 user service
// Loads or creates a UserProfile on every login and attaches the DB role
// as a Spring Security GrantedAuthority 
package com.sliit.smartcampus.service;

import com.sliit.smartcampus.entity.UserProfile;
import com.sliit.smartcampus.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserProfileRepository userProfileRepository;

    // Comma-separated admin emails set in application.properties
    // e.g. app.admin.emails=you@gmail.com,other@sliit.lk
    @Value("${app.admin.emails:}")
    private String adminEmailsConfig;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. Fetch user attributes from Google
        OAuth2User googleUser = super.loadUser(userRequest);

        String email   = googleUser.getAttribute("email");
        String name    = googleUser.getAttribute("name");
        String picture = googleUser.getAttribute("picture");

        // 2. Load or create the UserProfile in our DB
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setEmail(email);
                    return newProfile;
                });

        // 3. Update mutable fields on every login
        profile.setName(name);
        profile.setPicture(picture);

        // Always enforce admin seed: if email is in app.admin.emails, role must be ADMIN.
        // This also fixes existing USER records for admin emails.
        if (isSeededAdmin(email)) {
            profile.setRole(UserProfile.Role.ADMIN);
        } else if (profile.getRole() == null) {
            profile.setRole(UserProfile.Role.USER);
        }

        userProfileRepository.save(profile);

        // 4. Build GrantedAuthority from DB role (Spring expects "ROLE_" prefix)
        String springRole = "ROLE_" + profile.getRole().name(); // e.g. ROLE_ADMIN
        Set<SimpleGrantedAuthority> authorities = Set.of(new SimpleGrantedAuthority(springRole));

        // 5. Return a DefaultOAuth2User that carries our role authorities
        return new DefaultOAuth2User(
                authorities,
                googleUser.getAttributes(),
                "email" // the attribute used as the principal name
        );
    }

    private boolean isSeededAdmin(String email) {
        if (adminEmailsConfig == null || adminEmailsConfig.isBlank()) return false;
        for (String admin : adminEmailsConfig.split(",")) {
            if (admin.trim().equalsIgnoreCase(email)) return true;
        }
        return false;
    }
}

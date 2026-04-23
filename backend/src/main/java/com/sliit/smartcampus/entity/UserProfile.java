// Member 01 - Facilities & Security: UserProfile entity — persists role per Google account
package com.sliit.smartcampus.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;

    private String picture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastLoginAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastLoginAt = LocalDateTime.now();
    }

    public enum Role {
        USER,        // Default — students & staff
        TECHNICIAN,  // Maintenance staff — handles assigned incidents
        ADMIN        // Campus admin — full access
    }
}

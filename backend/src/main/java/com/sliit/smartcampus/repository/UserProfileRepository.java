// Member 01 - Facilities & Security: UserProfile JPA repository
package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByEmail(String email);

    List<UserProfile> findByRole(UserProfile.Role role);
}

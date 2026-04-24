// Member 01 - Facilities & Security: Resource JPA repository with filter queries
package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Filter by type (optional) and minimum capacity (optional)
    @Query("SELECT r FROM Resource r WHERE " +
            "(:type IS NULL OR r.type = :type) AND " +
            "(:minCapacity IS NULL OR r.capacity >= :minCapacity)")
    List<Resource> findByTypeAndMinCapacity(
            @Param("type") Resource.ResourceType type,
            @Param("minCapacity") Integer minCapacity);
}

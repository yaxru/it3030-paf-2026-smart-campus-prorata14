// Member 03 - Incident Ticketing & Notifications: Incident JPA repository
package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

        @Query("SELECT i FROM Incident i WHERE " +
                        "(:status IS NULL OR i.status = :status) AND " +
                        "(:priority IS NULL OR i.priority = :priority)")
        List<Incident> findByStatusAndPriority(
                        @Param("status") Incident.IncidentStatus status,
                        @Param("priority") Incident.Priority priority);

        // TECHNICIAN view: incidents assigned specifically to them
        @Query("SELECT i FROM Incident i WHERE i.assignedTo = :email AND " +
                        "(:status IS NULL OR i.status = :status) AND " +
                        "(:priority IS NULL OR i.priority = :priority)")
        List<Incident> findByAssignedToAndFilters(
                        @Param("email") String email,
                        @Param("status") Incident.IncidentStatus status,
                        @Param("priority") Incident.Priority priority);

        // USER view: only incidents reported by this user
        @Query("SELECT i FROM Incident i WHERE i.reportedBy = :email AND " +
                        "(:status IS NULL OR i.status = :status) AND " +
                        "(:priority IS NULL OR i.priority = :priority)")
        List<Incident> findByReportedByAndFilters(
                        @Param("email") String email,
                        @Param("status") Incident.IncidentStatus status,
                        @Param("priority") Incident.Priority priority);
}

// Member 01 - Facilities & Security: Resource REST controller
package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.entity.Resource;
import com.sliit.smartcampus.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    // GET /api/resources?type=LAB&minCapacity=30
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) Resource.ResourceType type,
            @RequestParam(required = false) Integer minCapacity) {
        return ResponseEntity.ok(resourceService.getAllResources(type, minCapacity));
    }

    // POST /api/resources (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(resource));
    }

    // PUT /api/resources/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.updateResource(id, resource));
    }

    // DELETE /api/resources/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}

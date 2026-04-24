// Member 01 - Facilities & Security: Resource service layer
package com.sliit.smartcampus.service;

import com.sliit.smartcampus.entity.Resource;
import com.sliit.smartcampus.repository.ResourceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources(Resource.ResourceType type, Integer minCapacity) {
        return resourceRepository.findByTypeAndMinCapacity(type, minCapacity);
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource updated) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found with id: " + id));
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setCapacity(updated.getCapacity());
        existing.setLocation(updated.getLocation());
        existing.setStatus(updated.getStatus());
        return resourceRepository.save(existing);
    }

    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new EntityNotFoundException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }
}

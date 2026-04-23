// Member 01 - Facilities & Security: Resource JPA entity
package com.sliit.smartcampus.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    private Integer capacity;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status;

    public enum ResourceType {
        LAB, HALL, EQUIP
    }

    public enum ResourceStatus {
        ACTIVE, OUT_OF_SERVICE
    }
}

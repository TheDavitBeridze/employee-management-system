package ge.edu.bsu.ems.department;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(
        name = "departments",
        schema = "dbo",
        uniqueConstraints = {
                @UniqueConstraint(name = "UK_departments_name", columnNames = "name")
        }
)
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (name != null) {
            name = name.trim();
        }
    }


    public void updateName(String name) {
        this.name = (name == null) ? null : name.trim();
    }

    public void updateDescription(String description) {
        this.description = description;
    }
}
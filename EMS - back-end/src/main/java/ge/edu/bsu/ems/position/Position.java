package ge.edu.bsu.ems.position;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(
        name = "positions",
        schema = "dbo",
        uniqueConstraints = {
                @UniqueConstraint(name = "UK_positions_name", columnNames = "name")
        }
)
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "base_salary", nullable = false, precision = 18, scale = 2)
    private BigDecimal baseSalary;

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

    public void updateBaseSalary(BigDecimal baseSalary) {
        this.baseSalary = baseSalary;
    }
}
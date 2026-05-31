package ge.edu.bsu.ems.position;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PositionRepository extends JpaRepository<Position, Long> {

    boolean existsByNameIgnoreCase(String name);

    Optional<Position> findByNameIgnoreCase(String name);
}
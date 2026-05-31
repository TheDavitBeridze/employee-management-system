package ge.edu.bsu.ems.position;

import ge.edu.bsu.ems.exception.ConflictException;
import ge.edu.bsu.ems.exception.ResourceNotFoundException;
import ge.edu.bsu.ems.position.dto.PositionCreateRequest;
import ge.edu.bsu.ems.position.dto.PositionResponse;
import ge.edu.bsu.ems.position.dto.PositionUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PositionService {

    private final PositionRepository repo;

    public PositionResponse create(PositionCreateRequest req) {
        String name = normalize(req.name());

        if (repo.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Position name already exists: " + name);
        }

        Position position = Position.builder()
                .name(name)
                .baseSalary(req.baseSalary())
                .build();

        return toResponse(repo.save(position));
    }

    @Transactional(readOnly = true)
    public PositionResponse getById(Long id) {
        Position position = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found: " + id));

        return toResponse(position);
    }

    @Transactional(readOnly = true)
    public List<PositionResponse> list() {
        return repo.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PositionResponse update(Long id, PositionUpdateRequest req) {
        Position position = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found: " + id));

        String newName = normalize(req.name());

        if (!newName.equalsIgnoreCase(position.getName()) && repo.existsByNameIgnoreCase(newName)) {
            throw new ConflictException("Position name already exists: " + newName);
        }

        position.updateName(newName);
        position.updateBaseSalary(req.baseSalary());

        return toResponse(repo.save(position));
    }

    public void delete(Long id) {
        Position position = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found: " + id));

        repo.delete(position);
    }


    private PositionResponse toResponse(Position p) {
        PositionResponse r = new PositionResponse();
        r.id = p.getId();
        r.name = p.getName();
        r.baseSalary = p.getBaseSalary();
        r.createdAt = p.getCreatedAt();
        return r;
    }

    private String normalize(String s) {
        return s == null ? null : s.trim();
    }
}
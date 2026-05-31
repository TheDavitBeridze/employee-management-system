package ge.edu.bsu.ems.department;

import ge.edu.bsu.ems.department.dto.DepartmentCreateRequest;
import ge.edu.bsu.ems.department.dto.DepartmentResponse;
import ge.edu.bsu.ems.department.dto.DepartmentUpdateRequest;
import ge.edu.bsu.ems.exception.ConflictException;
import ge.edu.bsu.ems.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentService {

    private final DepartmentRepository repo;

    public DepartmentResponse create(DepartmentCreateRequest req) {
        String name = normalize(req.name());

        if (repo.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Department name already exists: " + name);
        }

        Department dep = Department.builder()
                .name(name)
                .description(blankToNull(req.description()))
                .build();

        return toResponse(repo.save(dep));
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getById(Long id) {
        Department dep = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));
        return toResponse(dep);
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> list() {
        return repo.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DepartmentResponse update(Long id, DepartmentUpdateRequest req) {
        Department dep = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));

        String newName = normalize(req.name());


        if (!newName.equalsIgnoreCase(dep.getName()) && repo.existsByNameIgnoreCase(newName)) {
            throw new ConflictException("Department name already exists: " + newName);
        }

        dep.updateName(newName);
        dep.updateDescription(blankToNull(req.description()));


        return toResponse(repo.save(dep));
    }

    public void delete(Long id) {
        Department dep = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));

        repo.delete(dep);
    }

    private DepartmentResponse toResponse(Department d) {
        DepartmentResponse r = new DepartmentResponse();
        r.id = d.getId();
        r.name = d.getName();
        r.description = d.getDescription();
        r.createdAt = d.getCreatedAt();
        return r;
    }

    private String normalize(String s) {
        return s == null ? null : s.trim();
    }

    private String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}
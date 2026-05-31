package ge.edu.bsu.ems.position;

import ge.edu.bsu.ems.position.dto.PositionCreateRequest;
import ge.edu.bsu.ems.position.dto.PositionResponse;
import ge.edu.bsu.ems.position.dto.PositionUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/positions")
public class PositionController {

    private final PositionService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PositionResponse create(@Valid @RequestBody PositionCreateRequest req) {
        return service.create(req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public PositionResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<PositionResponse> list() {
        return service.list();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public PositionResponse update(@PathVariable Long id, @Valid @RequestBody PositionUpdateRequest req) {
        return service.update(id, req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
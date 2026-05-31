package ge.edu.bsu.ems.user;

import ge.edu.bsu.ems.user.dto.UserCreateRequest;
import ge.edu.bsu.ems.user.dto.UserResponse;
import ge.edu.bsu.ems.user.dto.UserUpdateRoleRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public UserResponse create(@Valid @RequestBody UserCreateRequest req) {
        return service.create(req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public UserResponse get(@PathVariable long id) {
        return service.getById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserResponse> list(@RequestParam(required = false) String q) {
        return service.search(q);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/role")
    public UserResponse updateRole(@PathVariable long id, @Valid @RequestBody UserUpdateRoleRequest req) {
        return service.setRole(id, req.role);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/enabled")
    public UserResponse setEnabled(@PathVariable long id, @RequestParam boolean enabled) {
        return service.setEnabled(id, enabled);
    }
}

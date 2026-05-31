package ge.edu.bsu.ems.employee.update_request;

import ge.edu.bsu.ems.employee.update_request.dto.EmployeeUpdateRequestCreateRequest;
import ge.edu.bsu.ems.employee.update_request.dto.EmployeeUpdateRequestResponse;
import ge.edu.bsu.ems.employee.update_request.dto.ManagerRejectRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EmployeeUpdateRequestController {

    private final EmployeeUpdateRequestService service;

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/api/me/update-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeUpdateRequestResponse createMyRequest(@Valid @RequestBody EmployeeUpdateRequestCreateRequest request) {
        return service.createForCurrentEmployee(request);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/api/me/update-requests")
    public List<EmployeeUpdateRequestResponse> listMyRequests() {
        return service.listMine();
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/api/manager/update-requests")
    public List<EmployeeUpdateRequestResponse> listPending() {
        return service.listPendingForManager();
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/update-requests/{id}/approve")
    public EmployeeUpdateRequestResponse approve(@PathVariable Long id) {
        return service.approve(id);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/update-requests/{id}/reject")
    public EmployeeUpdateRequestResponse reject(@PathVariable Long id, @Valid @RequestBody ManagerRejectRequest request) {
        return service.reject(id, request);
    }
}
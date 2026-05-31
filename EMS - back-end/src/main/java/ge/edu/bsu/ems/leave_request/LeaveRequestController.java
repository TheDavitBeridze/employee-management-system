package ge.edu.bsu.ems.leave_request;

import ge.edu.bsu.ems.leave_request.dto.LeaveRequestCreateRequest;
import ge.edu.bsu.ems.leave_request.dto.LeaveRequestResponse;
import ge.edu.bsu.ems.leave_request.dto.ManagerLeaveDecisionRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService service;

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/api/me/leave-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveRequestResponse create(@Valid @RequestBody LeaveRequestCreateRequest req) {
        return service.createForCurrentEmployee(req);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/api/me/leave-requests")
    public List<LeaveRequestResponse> listMine() {
        return service.listMine();
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/api/me/leave-requests/{id}/cancel")
    public LeaveRequestResponse cancel(@PathVariable Long id) {
        return service.cancelMyRequest(id);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/api/manager/leave-requests")
    public List<LeaveRequestResponse> listPendingForManager() {
        return service.listPendingForManager();
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/leave-requests/{id}/approve")
    public LeaveRequestResponse approve(
            @PathVariable Long id,
            @Valid @RequestBody ManagerLeaveDecisionRequest req
    ) {
        return service.approve(id, req);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/leave-requests/{id}/reject")
    public LeaveRequestResponse reject(
            @PathVariable Long id,
            @Valid @RequestBody ManagerLeaveDecisionRequest req
    ) {
        return service.reject(id, req);
    }
}
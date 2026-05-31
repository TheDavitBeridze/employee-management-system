package ge.edu.bsu.ems.attendance;

import ge.edu.bsu.ems.attendance.dto.AdminAttendanceSearchRequest;
import ge.edu.bsu.ems.attendance.dto.AttendanceResponse;
import ge.edu.bsu.ems.attendance.dto.DepartmentAttendanceSearchRequest;
import ge.edu.bsu.ems.attendance.dto.MyAttendanceSearchRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService service;

    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER')")
    @GetMapping("/api/me/attendance")
    public List<AttendanceResponse> listMine(@Valid @ModelAttribute MyAttendanceSearchRequest req) {
        return service.listMine(req);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/api/manager/attendance")
    public List<AttendanceResponse> listForManager(@Valid @ModelAttribute DepartmentAttendanceSearchRequest req) {
        return service.listForManager(req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/attendance")
    public List<AttendanceResponse> listAllForAdmin(@Valid @ModelAttribute AdminAttendanceSearchRequest req) {
        return service.listAllForAdmin(req);
    }
}
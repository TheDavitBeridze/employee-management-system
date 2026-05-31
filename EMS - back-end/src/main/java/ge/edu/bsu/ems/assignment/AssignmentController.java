package ge.edu.bsu.ems.assignment;

import ge.edu.bsu.ems.assignment.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ge.edu.bsu.ems.assignment.dto.AssignmentSubmitForm;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestPart;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/assignments")
    @ResponseStatus(HttpStatus.CREATED)
    public AssignmentResponse createDraft(@Valid @RequestBody AssignmentCreateRequest req) {
        return assignmentService.createDraft(req);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/assignments/{id}/assign")
    public AssignmentResponse assign(@PathVariable Long id,
                                     @Valid @RequestBody AssignmentAssignRequest req) {
        return assignmentService.assign(id, req);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/api/manager/assignments")
    public List<AssignmentResponse> listForManagerDepartment() {
        return assignmentService.listForManagerDepartment();
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/assignments/{id}/approve")
    public AssignmentResponse approve(@PathVariable Long id,
                                      @Valid @RequestBody AssignmentDecisionRequest req) {
        return assignmentService.approve(id, req);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/assignments/{id}/reject")
    public AssignmentResponse reject(@PathVariable Long id,
                                     @Valid @RequestBody AssignmentDecisionRequest req) {
        return assignmentService.reject(id, req);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/api/manager/assignments/{id}/deadline")
    public AssignmentResponse updateDeadline(@PathVariable Long id,
                                             @Valid @RequestBody AssignmentDeadlineUpdateRequest req) {
        return assignmentService.updateDeadline(id, req);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/api/manager/assignments/{id}/reassign")
    public AssignmentResponse reassign(@PathVariable Long id,
                                       @Valid @RequestBody AssignmentReassignRequest req) {
        return assignmentService.reassign(id, req);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/assignments/{id}/cancel")
    public AssignmentResponse cancel(@PathVariable Long id,
                                     @Valid @RequestBody AssignmentDecisionRequest req) {
        return assignmentService.cancel(id, req);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/api/manager/assignments/{id}/file")
    public ResponseEntity<byte[]> downloadSubmissionFile(@PathVariable Long id) {
        AssignmentFileDownloadResponse file = assignmentService.downloadSubmissionFile(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.fileName() + "\"")
                .contentType(MediaType.parseMediaType(file.contentType()))
                .body(file.data());
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/api/me/assignments")
    public List<AssignmentResponse> listMine() {
        return assignmentService.listMine();
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping(value = "/api/me/assignments/{id}/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AssignmentResponse submit(
            @PathVariable Long id,
            @Valid @RequestPart("data") AssignmentSubmitForm form,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        return assignmentService.submit(id, form, file);
    }
}
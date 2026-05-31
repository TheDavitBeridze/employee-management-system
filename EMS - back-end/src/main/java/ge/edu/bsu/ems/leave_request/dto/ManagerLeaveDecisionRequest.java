package ge.edu.bsu.ems.leave_request.dto;

import jakarta.validation.constraints.Size;

public record ManagerLeaveDecisionRequest(
        @Size(max = 500, message = "managerComment max length is 500")
        String managerComment
) { }
package ge.edu.bsu.ems.assignment.dto;

import jakarta.validation.constraints.Size;

public record AssignmentDecisionRequest(
        @Size(max = 1000, message = "managerComment max length is 1000")
        String managerComment
) { }
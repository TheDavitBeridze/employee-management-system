package ge.edu.bsu.ems.assignment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AssignmentSubmitForm(
        @NotBlank(message = "submissionComment is required")
        @Size(max = 2000, message = "submissionComment max length is 2000")
        String submissionComment,

        @Size(max = 1000, message = "submissionLink max length is 1000")
        String submissionLink
) { }
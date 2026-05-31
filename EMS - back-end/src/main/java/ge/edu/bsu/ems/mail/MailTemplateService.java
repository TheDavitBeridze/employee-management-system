package ge.edu.bsu.ems.mail;

import org.springframework.stereotype.Service;

@Service
public class MailTemplateService {

    public String welcomeSubject() {
        return "Welcome to EMS";
    }

    public String welcomeBody(String fullName) {
        return """
                Hello %s,

                Welcome to EMS.
                Your employee account has been created successfully.

                You can now use your assigned email to log in.

                Best regards,
                EMS Team
                """.formatted(fullName);
    }

    public String assignmentAssignedSubject() {
        return "New assignment assigned";
    }

    public String assignmentAssignedBody(String employeeName, String assignmentTitle, String managerName) {
        return """
                Hello %s,

                A new assignment has been assigned to you.

                Assignment: %s
                Assigned by: %s

                Please log in to EMS for details.

                Best regards,
                EMS Team
                """.formatted(employeeName, assignmentTitle, managerName);
    }

    public String assignmentApprovedSubject() {
        return "Assignment approved";
    }

    public String assignmentApprovedBody(String employeeName, String assignmentTitle, String managerComment) {
        return """
                Hello %s,

                Your submitted assignment has been approved.

                Assignment: %s
                Manager comment: %s

                Best regards,
                EMS Team
                """.formatted(
                employeeName,
                assignmentTitle,
                managerComment == null || managerComment.isBlank() ? "-" : managerComment
        );
    }

    public String assignmentRejectedSubject() {
        return "Assignment rejected";
    }

    public String assignmentRejectedBody(String employeeName, String assignmentTitle, String managerComment) {
        return """
                Hello %s,

                Your submitted assignment has been rejected.

                Assignment: %s
                Manager comment: %s

                Please review the feedback in EMS.

                Best regards,
                EMS Team
                """.formatted(
                employeeName,
                assignmentTitle,
                managerComment == null || managerComment.isBlank() ? "-" : managerComment
        );
    }

    public String leaveRequestApprovedSubject() {
        return "Leave request approved";
    }

    public String leaveRequestApprovedBody(String employeeName, String startDate, String endDate, String managerComment) {
        return """
                Hello %s,

                Your leave request has been approved.

                Leave period: %s - %s
                Manager comment: %s

                Best regards,
                EMS Team
                """.formatted(
                employeeName,
                startDate,
                endDate,
                managerComment == null || managerComment.isBlank() ? "-" : managerComment
        );
    }

    public String leaveRequestRejectedSubject() {
        return "Leave request rejected";
    }

    public String leaveRequestRejectedBody(String employeeName, String startDate, String endDate, String managerComment) {
        return """
                Hello %s,

                Your leave request has been rejected.

                Leave period: %s - %s
                Manager comment: %s

                Please review the feedback in EMS.

                Best regards,
                EMS Team
                """.formatted(
                employeeName,
                startDate,
                endDate,
                managerComment == null || managerComment.isBlank() ? "-" : managerComment
        );
    }

    public String updateRequestApprovedSubject() {
        return "Profile update request approved";
    }

    public String updateRequestApprovedBody(String employeeName) {
        return """
                Hello %s,

                Your profile update request has been approved.

                If your email or password was changed, please sign in again using your updated credentials.

                Best regards,
                EMS Team
                """.formatted(employeeName);
    }

    public String updateRequestRejectedSubject() {
        return "Profile update request rejected";
    }

    public String updateRequestRejectedBody(String employeeName, String reason) {
        return """
                Hello %s,

                Your profile update request has been rejected.

                Manager comment: %s

                Please review the feedback in EMS.

                Best regards,
                EMS Team
                """.formatted(
                employeeName,
                reason == null || reason.isBlank() ? "-" : reason
        );
    }
}
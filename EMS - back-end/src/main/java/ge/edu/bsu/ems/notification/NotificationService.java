package ge.edu.bsu.ems.notification;

public interface NotificationService {

    void sendWelcomeEmail(String to, String fullName);

    void sendAssignmentAssignedEmail(String to, String employeeName, String assignmentTitle, String managerName);

    void sendAssignmentApprovedEmail(String to, String employeeName, String assignmentTitle, String managerComment);

    void sendAssignmentRejectedEmail(String to, String employeeName, String assignmentTitle, String managerComment);
}
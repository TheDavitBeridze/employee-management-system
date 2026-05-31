package ge.edu.bsu.ems.notification;

import ge.edu.bsu.ems.mail.MailService;
import ge.edu.bsu.ems.mail.MailTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final MailService mailService;
    private final MailTemplateService mailTemplateService;

    @Override
    public void sendWelcomeEmail(String to, String fullName) {
        sendSafely(
                to,
                mailTemplateService.welcomeSubject(),
                mailTemplateService.welcomeBody(fullName)
        );
    }

    @Override
    public void sendAssignmentAssignedEmail(String to, String employeeName, String assignmentTitle, String managerName) {
        sendSafely(
                to,
                mailTemplateService.assignmentAssignedSubject(),
                mailTemplateService.assignmentAssignedBody(employeeName, assignmentTitle, managerName)
        );
    }

    @Override
    public void sendAssignmentApprovedEmail(String to, String employeeName, String assignmentTitle, String managerComment) {
        sendSafely(
                to,
                mailTemplateService.assignmentApprovedSubject(),
                mailTemplateService.assignmentApprovedBody(employeeName, assignmentTitle, managerComment)
        );
    }

    @Override
    public void sendAssignmentRejectedEmail(String to, String employeeName, String assignmentTitle, String managerComment) {
        sendSafely(
                to,
                mailTemplateService.assignmentRejectedSubject(),
                mailTemplateService.assignmentRejectedBody(employeeName, assignmentTitle, managerComment)
        );
    }

    private void sendSafely(String to, String subject, String body) {
        try {
            mailService.send(to, subject, body);
        } catch (Exception ex) {
            log.error("Failed to send email to {}", to, ex);
        }
    }
}
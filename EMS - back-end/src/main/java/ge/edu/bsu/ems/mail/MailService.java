package ge.edu.bsu.ems.mail;

public interface MailService {
    void send(String to, String subject, String text);
}
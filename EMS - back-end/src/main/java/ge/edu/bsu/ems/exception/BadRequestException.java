package ge.edu.bsu.ems.exception;

//400
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
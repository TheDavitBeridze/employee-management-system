package ge.edu.bsu.ems.exception;


//409
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
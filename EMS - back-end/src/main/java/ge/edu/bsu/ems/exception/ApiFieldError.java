package ge.edu.bsu.ems.exception;

public record ApiFieldError(
        String field,
        Object rejectedValue,
        String message
) {}
package ge.edu.bsu.ems.exception;

import java.time.OffsetDateTime;
import java.util.List;

public record ApiError(
        OffsetDateTime timestamp,
        int status,
        String error,
        ErrorCode code,
        String message,
        String path,
        String traceId,
        List<ApiFieldError> fieldErrors
) {}
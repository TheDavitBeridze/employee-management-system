package ge.edu.bsu.ems.assignment.dto;

public record AssignmentFileDownloadResponse(
        String fileName,
        String contentType,
        byte[] data
) { }
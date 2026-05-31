package ge.edu.bsu.ems.auth.dto;

public record LoginResponse(
        String token,
        Long userId,
        String email,
        String role
) {}
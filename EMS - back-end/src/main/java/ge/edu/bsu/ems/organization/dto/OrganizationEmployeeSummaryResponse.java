package ge.edu.bsu.ems.organization.dto;

public record OrganizationEmployeeSummaryResponse(
        Long employeeId,
        Long userId,
        String fullName,
        String phone,
        String positionName,
        String status
) { }
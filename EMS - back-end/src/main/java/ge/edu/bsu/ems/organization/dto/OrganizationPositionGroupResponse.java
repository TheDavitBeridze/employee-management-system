package ge.edu.bsu.ems.organization.dto;

import java.util.List;

public record OrganizationPositionGroupResponse(
        Long positionId,
        String positionName,
        List<OrganizationEmployeeSummaryResponse> employees
) { }
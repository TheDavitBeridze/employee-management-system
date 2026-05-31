package ge.edu.bsu.ems.organization.dto;

import java.util.List;

public record OrganizationDepartmentStructureResponse(
        Long departmentId,
        String departmentName,
        String departmentDescription,
        OrganizationEmployeeSummaryResponse manager,
        List<OrganizationPositionGroupResponse> positions
) { }
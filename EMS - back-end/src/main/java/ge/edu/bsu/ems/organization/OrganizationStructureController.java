package ge.edu.bsu.ems.organization;

import ge.edu.bsu.ems.organization.dto.OrganizationDepartmentStructureResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/organization-structure")
public class OrganizationStructureController {

    private final OrganizationStructureService organizationStructureService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<OrganizationDepartmentStructureResponse> list() {
        return organizationStructureService.listOrganizationStructure();
    }
}
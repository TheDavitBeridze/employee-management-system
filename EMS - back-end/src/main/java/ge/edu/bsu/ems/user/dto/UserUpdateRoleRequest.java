package ge.edu.bsu.ems.user.dto;

import ge.edu.bsu.ems.user.UserRole;
import jakarta.validation.constraints.NotNull;

public class UserUpdateRoleRequest {
    @NotNull
    public UserRole role;
}

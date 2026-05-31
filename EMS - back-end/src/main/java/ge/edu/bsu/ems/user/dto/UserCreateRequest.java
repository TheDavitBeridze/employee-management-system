package ge.edu.bsu.ems.user.dto;

import ge.edu.bsu.ems.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserCreateRequest {

    @NotBlank
    @Email
    @Size(max = 255)
    public String email;

    @NotBlank
    @Size(min = 6, max = 72)
    public String password;

    @NotNull
    public UserRole role;
}

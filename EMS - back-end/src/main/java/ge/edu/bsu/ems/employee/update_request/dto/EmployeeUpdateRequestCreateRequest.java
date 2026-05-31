package ge.edu.bsu.ems.employee.update_request.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


public record EmployeeUpdateRequestCreateRequest(

        @Size(min = 2, max = 50, message = "First name must be 2-50 characters")
        String firstName,

        @Size(min = 2, max = 50, message = "Last name must be 2-50 characters")
        String lastName,

        @Email(message = "Email must be valid")
        @Size(max = 120, message = "Email max length is 120")
        String email,

        @Size(min = 6, max = 72, message = "Password must be 6-72 characters")
        String password,

        @Size(min = 9, max = 20, message = "Phone number must be 9-20 characters")
        @Pattern(
                regexp = "^[0-9+]*$",
                message = "Phone number can contain only digits and '+'"
        )
        String phone

) { }
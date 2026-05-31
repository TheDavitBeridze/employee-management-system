package ge.edu.bsu.ems.user.dto;

import ge.edu.bsu.ems.user.UserRole;
import java.time.LocalDateTime ;

public class UserResponse {
    public Long id;
    public String email;
    public UserRole role;
    public boolean enabled;
    public LocalDateTime  createdAt;
}

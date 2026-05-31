package ge.edu.bsu.ems.auth;

import ge.edu.bsu.ems.attendance.AttendanceService;
import ge.edu.bsu.ems.auth.dto.LoginRequest;
import ge.edu.bsu.ems.auth.dto.LoginResponse;
import ge.edu.bsu.ems.exception.ConflictException;
import ge.edu.bsu.ems.security.JwtService;
import ge.edu.bsu.ems.user.User;
import ge.edu.bsu.ems.user.UserRepository;
import ge.edu.bsu.ems.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AttendanceService attendanceService;

    public LoginResponse login(LoginRequest req) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(req.email());

        if (!passwordEncoder.matches(req.password(), userDetails.getPassword())) {
            throw new ConflictException("Invalid credentials");
        }

        User user = userRepository.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new ConflictException("Invalid credentials"));

        if (user.getRole() == UserRole.EMPLOYEE || user.getRole() == UserRole.MANAGER) {
            attendanceService.registerCheckInByUserId(user.getId());
        }

        String token = jwtService.generateToken(userDetails.getUsername());

        return new LoginResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
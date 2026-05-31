package ge.edu.bsu.ems.bootstrap;

import ge.edu.bsu.ems.user.UserRole;
import ge.edu.bsu.ems.user.User;
import ge.edu.bsu.ems.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;


    // default ადმინი
    // ახალი ადმინის დამატების შემთხვევაში default ადმინი არავალიდური ხდება და მისი გამოყენება იზღუდება

@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User admin = User.builder()
                .email("admin@test.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(UserRole.ADMIN)
                .enabled(true)
                .build();

        userRepository.save(admin);

        System.out.println(" Bootstrap ADMIN created: admin@test.com / admin123");
    }
}
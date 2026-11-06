package com.lms.backend.service;

import com.lms.backend.dto.JwtResponse;
import com.lms.backend.dto.LoginRequest;
import com.lms.backend.dto.RegisterRequest;
import com.lms.backend.dto.UserResponse;
import com.lms.backend.exception.BadRequestException;
import com.lms.backend.model.Role;
import com.lms.backend.model.User;
import com.lms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Value("${app.admin-registration-code}")
    private String adminRegistrationCode;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        if (request.getRole() == Role.ADMIN) {
            if (request.getAdminCode() == null || !adminRegistrationCode.equals(request.getAdminCode().trim())) {
                throw new BadRequestException("Invalid admin registration code");
            }
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();

        User saved = userRepository.save(user);
        return UserResponse.fromEntity(saved);
    }

    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new JwtResponse(token, UserResponse.fromEntity(user));
    }
}

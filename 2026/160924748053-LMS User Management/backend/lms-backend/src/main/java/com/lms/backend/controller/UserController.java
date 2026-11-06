package com.lms.backend.controller;

import com.lms.backend.dto.DomainRequest;
import com.lms.backend.dto.UpdateProfileRequest;
import com.lms.backend.dto.UpdateUserRequest;
import com.lms.backend.dto.UserResponse;
import com.lms.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserByEmail(authentication.getName()));
    }

    // Self-service profile edit: name, date of birth, bio, avatar only.
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateOwnProfile(Authentication authentication,
                                                           @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateOwnProfile(authentication.getName(), request));
    }

    // Any logged-in user selects/updates the domain they're interested in.
    @PutMapping("/me/domain")
    public ResponseEntity<UserResponse> updateOwnDomain(Authentication authentication,
                                                          @Valid @RequestBody DomainRequest request) {
        return ResponseEntity.ok(userService.updateOwnDomain(authentication.getName(), request));
    }

    // Instructor-only: the single domain they teach.
    @PutMapping("/me/teaching-domain")
    public ResponseEntity<UserResponse> updateOwnTeachingDomain(Authentication authentication,
                                                                  @Valid @RequestBody DomainRequest request) {
        return ResponseEntity.ok(userService.updateOwnTeachingDomain(authentication.getName(), request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id,
                                                     @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

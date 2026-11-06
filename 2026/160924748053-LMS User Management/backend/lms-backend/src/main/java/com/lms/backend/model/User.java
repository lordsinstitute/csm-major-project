package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true;

    // One of the fixed, server-defined avatar ids (see AppConstants.AVATAR_IDS).
    // Users pick from this preset list only - there is no image upload.
    @Column(length = 30)
    private String avatarId;

    private LocalDate dateOfBirth;

    @Column(length = 1000)
    private String bio;

    // Domain the user is interested in / studying (selected after login).
    @Column(length = 60)
    private String domain;

    // Only meaningful for INSTRUCTOR accounts: the single domain they teach.
    @Column(length = 60)
    private String teachingDomain;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

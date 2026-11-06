package com.lms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

/**
 * Fields a user is allowed to change about their OWN account.
 * Deliberately excludes email/role/enabled - those stay admin-only
 * (see UpdateUserRequest / UserController's admin endpoints).
 */
@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Size(max = 1000, message = "Bio must be at most 1000 characters")
    private String bio;

    // Must be one of AppConstants.AVATAR_IDS
    private String avatarId;
}

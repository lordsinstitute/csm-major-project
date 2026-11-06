package com.lms.backend.dto;

import com.lms.backend.model.Role;
import com.lms.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private boolean enabled;
    private String avatarId;
    private LocalDate dateOfBirth;
    private String bio;
    private String domain;
    private String teachingDomain;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled(),
                user.getAvatarId(),
                user.getDateOfBirth(),
                user.getBio(),
                user.getDomain(),
                user.getTeachingDomain(),
                user.getCreatedAt()
        );
    }
}

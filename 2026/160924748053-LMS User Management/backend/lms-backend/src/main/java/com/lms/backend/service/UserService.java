package com.lms.backend.service;

import com.lms.backend.common.AppConstants;
import com.lms.backend.dto.DomainRequest;
import com.lms.backend.dto.UpdateProfileRequest;
import com.lms.backend.dto.UpdateUserRequest;
import com.lms.backend.dto.UserResponse;
import com.lms.backend.exception.BadRequestException;
import com.lms.backend.exception.ResourceNotFoundException;
import com.lms.backend.model.Role;
import com.lms.backend.model.User;
import com.lms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = findUserOrThrow(id);
        return UserResponse.fromEntity(user);
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserResponse.fromEntity(user);
    }

    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = findUserOrThrow(id);
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }
        return UserResponse.fromEntity(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = findUserOrThrow(id);
        userRepository.delete(user);
    }

    /**
     * A user editing their own profile. Only name, date of birth, bio and
     * avatar can change here - email/role/enabled require an admin.
     */
    public UserResponse updateOwnProfile(String email, UpdateProfileRequest request) {
        User user = findUserByEmailOrThrow(email);

        if (request.getAvatarId() != null && !request.getAvatarId().isBlank()
                && !AppConstants.AVATAR_IDS.contains(request.getAvatarId())) {
            throw new BadRequestException("Invalid avatar selection");
        }

        user.setFullName(request.getFullName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setBio(request.getBio());
        if (request.getAvatarId() != null && !request.getAvatarId().isBlank()) {
            user.setAvatarId(request.getAvatarId());
        }
        return UserResponse.fromEntity(userRepository.save(user));
    }

    /** Any logged-in user selects/updates the domain they're interested in. */
    public UserResponse updateOwnDomain(String email, DomainRequest request) {
        User user = findUserByEmailOrThrow(email);
        if (!AppConstants.DOMAINS.contains(request.getDomain())) {
            throw new BadRequestException("Invalid domain selection");
        }
        user.setDomain(request.getDomain());
        return UserResponse.fromEntity(userRepository.save(user));
    }

    /** Only INSTRUCTOR accounts may set the domain they teach. */
    public UserResponse updateOwnTeachingDomain(String email, DomainRequest request) {
        User user = findUserByEmailOrThrow(email);
        if (user.getRole() != Role.INSTRUCTOR) {
            throw new BadRequestException("Only instructors can select a teaching domain");
        }
        if (!AppConstants.DOMAINS.contains(request.getDomain())) {
            throw new BadRequestException("Invalid domain selection");
        }
        user.setTeachingDomain(request.getDomain());
        return UserResponse.fromEntity(userRepository.save(user));
    }

    private User findUserByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}

package com.fitlink.service;

import com.fitlink.dto.gym.CreateGymProfileRequest;
import com.fitlink.dto.gym.GymProfileResponse;
import com.fitlink.entity.GymProfile;
import com.fitlink.entity.User;
import com.fitlink.entity.UserRole;
import com.fitlink.exception.BadRequestException;
import com.fitlink.exception.ResourceNotFoundException;
import com.fitlink.repository.GymProfileRepository;
import com.fitlink.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class GymProfileService {

    @Autowired
    private GymProfileRepository gymProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public GymProfileResponse createProfile(UUID userId, CreateGymProfileRequest request) {
        log.info("Creating gym profile for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getRole().equals(UserRole.GYM)) {
            throw new BadRequestException("User is not a gym");
        }

        if (gymProfileRepository.findByUserId(userId).isPresent()) {
            throw new BadRequestException("Gym profile already exists for this user");
        }

        GymProfile profile = new GymProfile();
        profile.setUser(user);
        profile.setGymName(request.getGymName());
        profile.setAddress(request.getAddress());
        profile.setFacilities(request.getFacilities());
        profile.setDescription(request.getDescription());
        profile.setCreatedAt(LocalDateTime.now());

        gymProfileRepository.save(profile);

        return mapToResponse(profile, user);
    }

    public GymProfileResponse updateProfile(UUID userId, CreateGymProfileRequest request) {
        log.info("Updating gym profile for user: {}", userId);

        GymProfile profile = gymProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym profile not found"));

        profile.setGymName(request.getGymName());
        profile.setAddress(request.getAddress());
        profile.setFacilities(request.getFacilities());
        profile.setDescription(request.getDescription());
        profile.setUpdatedAt(LocalDateTime.now());

        gymProfileRepository.save(profile);

        return mapToResponse(profile, profile.getUser());
    }

    public GymProfileResponse getProfile(UUID userId) {
        log.info("Fetching gym profile for user: {}", userId);

        GymProfile profile = gymProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym profile not found"));

        return mapToResponse(profile, profile.getUser());
    }

    private GymProfileResponse mapToResponse(GymProfile profile, User user) {
        return GymProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .name(user.getName())
                .email(user.getEmail())
                .gymName(profile.getGymName())
                .address(profile.getAddress())
                .facilities(profile.getFacilities())
                .description(profile.getDescription())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}

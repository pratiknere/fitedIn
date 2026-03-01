package com.fitlink.service;

import com.fitlink.dto.trainer.CreateTrainerProfileRequest;
import com.fitlink.dto.trainer.TrainerProfileResponse;
import com.fitlink.entity.TrainerProfile;
import com.fitlink.entity.User;
import com.fitlink.entity.UserRole;
import com.fitlink.exception.BadRequestException;
import com.fitlink.exception.ResourceNotFoundException;
import com.fitlink.repository.TrainerProfileRepository;
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
public class TrainerProfileService {

    @Autowired
    private TrainerProfileRepository trainerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public TrainerProfileResponse createProfile(UUID userId, CreateTrainerProfileRequest request) {
        log.info("Creating trainer profile for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getRole().equals(UserRole.TRAINER)) {
            throw new BadRequestException("User is not a trainer");
        }

        if (trainerProfileRepository.findByUserId(userId).isPresent()) {
            throw new BadRequestException("Trainer profile already exists for this user");
        }

        TrainerProfile profile = new TrainerProfile();
        profile.setUser(user);
        profile.setExperienceYears(request.getExperienceYears());
        profile.setSpecialization(request.getSpecialization());
        profile.setCertifications(request.getCertifications());
        profile.setBio(request.getBio());
        profile.setCreatedAt(LocalDateTime.now());

        trainerProfileRepository.save(profile);

        return mapToResponse(profile, user);
    }

    public TrainerProfileResponse updateProfile(UUID userId, CreateTrainerProfileRequest request) {
        log.info("Updating trainer profile for user: {}", userId);

        TrainerProfile profile = trainerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer profile not found"));

        profile.setExperienceYears(request.getExperienceYears());
        profile.setSpecialization(request.getSpecialization());
        profile.setCertifications(request.getCertifications());
        profile.setBio(request.getBio());
        profile.setUpdatedAt(LocalDateTime.now());

        trainerProfileRepository.save(profile);

        return mapToResponse(profile, profile.getUser());
    }

    public TrainerProfileResponse getProfile(UUID userId) {
        log.info("Fetching trainer profile for user: {}", userId);

        TrainerProfile profile = trainerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer profile not found"));

        return mapToResponse(profile, profile.getUser());
    }

    private TrainerProfileResponse mapToResponse(TrainerProfile profile, User user) {
        return TrainerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .name(user.getName())
                .email(user.getEmail())
                .experienceYears(profile.getExperienceYears())
                .specialization(profile.getSpecialization())
                .certifications(profile.getCertifications())
                .totalClients(profile.getTotalClients())
                .bio(profile.getBio())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}

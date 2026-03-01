package com.fitlink.service;

import com.fitlink.dto.achievement.AchievementResponse;
import com.fitlink.dto.achievement.CreateAchievementRequest;
import com.fitlink.entity.Achievement;
import com.fitlink.entity.User;
import com.fitlink.entity.UserRole;
import com.fitlink.exception.BadRequestException;
import com.fitlink.exception.ResourceNotFoundException;
import com.fitlink.repository.AchievementRepository;
import com.fitlink.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserRepository userRepository;

    public AchievementResponse createAchievement(UUID trainerId, CreateAchievementRequest request) {
        log.info("Creating achievement for trainer: {}", trainerId);

        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

        if (!trainer.getRole().equals(UserRole.TRAINER)) {
            throw new BadRequestException("Only trainers can post achievements");
        }

        Achievement achievement = new Achievement();
        achievement.setTrainer(trainer);
        achievement.setTitle(request.getTitle());
        achievement.setDescription(request.getDescription());
        achievement.setImageUrl(request.getImageUrl());
        achievement.setCreatedAt(LocalDateTime.now());

        achievementRepository.save(achievement);

        return mapToResponse(achievement);
    }

    public AchievementResponse getAchievement(UUID achievementId) {
        log.info("Fetching achievement: {}", achievementId);

        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found"));

        return mapToResponse(achievement);
    }

    public Page<AchievementResponse> getFeed(Pageable pageable) {
        log.info("Fetching achievement feed");

        return achievementRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    public Page<AchievementResponse> getAchievementsByTrainer(UUID trainerId, Pageable pageable) {
        log.info("Fetching achievements for trainer: {}", trainerId);

        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

        return achievementRepository.findByTrainerIdOrderByCreatedAtDesc(trainerId, pageable)
                .map(this::mapToResponse);
    }

    public void deleteAchievement(UUID achievementId, UUID trainerId) {
        log.info("Deleting achievement: {}", achievementId);

        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found"));

        if (!achievement.getTrainer().getId().equals(trainerId)) {
            throw new BadRequestException("You can only delete your own achievements");
        }

        achievementRepository.deleteById(achievementId);
    }

    private AchievementResponse mapToResponse(Achievement achievement) {
        return AchievementResponse.builder()
                .id(achievement.getId())
                .trainerId(achievement.getTrainer().getId())
                .trainerName(achievement.getTrainer().getName())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .imageUrl(achievement.getImageUrl())
                .createdAt(achievement.getCreatedAt())
                .updatedAt(achievement.getUpdatedAt())
                .build();
    }
}

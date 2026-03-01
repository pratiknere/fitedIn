package com.fitlink.controller;

import com.fitlink.dto.ApiResponse;
import com.fitlink.dto.achievement.AchievementResponse;
import com.fitlink.dto.achievement.CreateAchievementRequest;
import com.fitlink.service.AchievementService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:4200")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @PostMapping
    public ResponseEntity<ApiResponse<AchievementResponse>> createAchievement(
            @RequestAttribute("userId") UUID trainerId,
            @Valid @RequestBody CreateAchievementRequest request) {
        log.info("POST /api/achievements - Creating achievement for trainer: {}", trainerId);
        AchievementResponse response = achievementService.createAchievement(trainerId, request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Achievement posted successfully", response),
                HttpStatus.CREATED);
    }

    @GetMapping("/{achievementId}")
    public ResponseEntity<ApiResponse<AchievementResponse>> getAchievement(@PathVariable UUID achievementId) {
        log.info("GET /api/achievements/{} - Fetching achievement", achievementId);
        AchievementResponse response = achievementService.getAchievement(achievementId);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Achievement fetched successfully", response),
                HttpStatus.OK);
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<Page<AchievementResponse>>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("GET /api/achievements/feed - Fetching achievement feed, page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AchievementResponse> response = achievementService.getFeed(pageable);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Feed fetched successfully", response),
                HttpStatus.OK);
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<ApiResponse<Page<AchievementResponse>>> getTrainerAchievements(
            @PathVariable UUID trainerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("GET /api/achievements/trainer/{} - Fetching achievements for trainer", trainerId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AchievementResponse> response = achievementService.getAchievementsByTrainer(trainerId, pageable);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Achievements fetched successfully", response),
                HttpStatus.OK);
    }

    @DeleteMapping("/{achievementId}")
    public ResponseEntity<ApiResponse<Void>> deleteAchievement(
            @PathVariable UUID achievementId,
            @RequestAttribute("userId") UUID trainerId) {
        log.info("DELETE /api/achievements/{} - Deleting achievement", achievementId);
        achievementService.deleteAchievement(achievementId, trainerId);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Achievement deleted successfully"),
                HttpStatus.NO_CONTENT);
    }
}

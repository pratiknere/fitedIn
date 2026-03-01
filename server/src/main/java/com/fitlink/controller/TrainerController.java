package com.fitlink.controller;

import com.fitlink.dto.ApiResponse;
import com.fitlink.dto.trainer.CreateTrainerProfileRequest;
import com.fitlink.dto.trainer.TrainerProfileResponse;
import com.fitlink.service.TrainerProfileService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/trainer")
@CrossOrigin(origins = "http://localhost:4200")
public class TrainerController {

    @Autowired
    private TrainerProfileService trainerProfileService;

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<TrainerProfileResponse>> createProfile(
            @RequestAttribute("userId") UUID userId,
            @Valid @RequestBody CreateTrainerProfileRequest request) {
        log.info("POST /api/trainer/profile - Creating profile for trainer: {}", userId);
        TrainerProfileResponse response = trainerProfileService.createProfile(userId, request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Profile created successfully", response),
                HttpStatus.CREATED);
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<TrainerProfileResponse>> updateProfile(
            @RequestAttribute("userId") UUID userId,
            @Valid @RequestBody CreateTrainerProfileRequest request) {
        log.info("PUT /api/trainer/profile - Updating profile for trainer: {}", userId);
        TrainerProfileResponse response = trainerProfileService.updateProfile(userId, request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Profile updated successfully", response),
                HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<TrainerProfileResponse>> getProfile(
            @RequestAttribute("userId") UUID userId) {
        log.info("GET /api/trainer/profile - Fetching profile for trainer: {}", userId);
        TrainerProfileResponse response = trainerProfileService.getProfile(userId);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Profile fetched successfully", response),
                HttpStatus.OK);
    }
}

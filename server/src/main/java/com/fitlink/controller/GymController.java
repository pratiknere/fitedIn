package com.fitlink.controller;

import com.fitlink.dto.ApiResponse;
import com.fitlink.dto.gym.CreateGymProfileRequest;
import com.fitlink.dto.gym.GymProfileResponse;
import com.fitlink.service.GymProfileService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/gym")
@CrossOrigin(origins = "http://localhost:4200")
public class GymController {

    @Autowired
    private GymProfileService gymProfileService;

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<GymProfileResponse>> createProfile(
            @RequestAttribute("userId") UUID userId,
            @Valid @RequestBody CreateGymProfileRequest request) {
        log.info("POST /api/gym/profile - Creating profile for gym: {}", userId);
        GymProfileResponse response = gymProfileService.createProfile(userId, request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Profile created successfully", response),
                HttpStatus.CREATED);
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<GymProfileResponse>> updateProfile(
            @RequestAttribute("userId") UUID userId,
            @Valid @RequestBody CreateGymProfileRequest request) {
        log.info("PUT /api/gym/profile - Updating profile for gym: {}", userId);
        GymProfileResponse response = gymProfileService.updateProfile(userId, request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Profile updated successfully", response),
                HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<GymProfileResponse>> getProfile(
            @RequestAttribute("userId") UUID userId) {
        log.info("GET /api/gym/profile - Fetching profile for gym: {}", userId);
        GymProfileResponse response = gymProfileService.getProfile(userId);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Profile fetched successfully", response),
                HttpStatus.OK);
    }
}

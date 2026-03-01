package com.fitlink.controller;

import com.fitlink.dto.ApiResponse;
import com.fitlink.dto.auth.LoginRequest;
import com.fitlink.dto.auth.LoginResponse;
import com.fitlink.dto.auth.RegisterRequest;
import com.fitlink.dto.auth.RegisterResponse;
import com.fitlink.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/auth/register - Registering user: {}", request.getEmail());
        RegisterResponse response = authService.register(request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "User registered successfully", response),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/auth/login - Login attempt for email: {}", request.getEmail());
        LoginResponse response = authService.login(request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Login successful", response),
                HttpStatus.OK);
    }
}

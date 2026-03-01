package com.fitlink.dto.auth;

import com.fitlink.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private UUID userId;
    private String name;
    private String email;
    private UserRole role;
    private String accessToken;
    private String tokenType = "Bearer";
}

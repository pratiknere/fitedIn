package com.fitlink.dto.trainer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerProfileResponse {
    private UUID id;
    private UUID userId;
    private String name;
    private String email;
    private Integer experienceYears;
    private String specialization;
    private String certifications;
    private Integer totalClients;
    private String bio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

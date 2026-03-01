package com.fitlink.dto.job;

import com.fitlink.entity.JobStatus;
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
public class JobResponse {
    private UUID id;
    private UUID gymId;
    private String gymName;
    private String title;
    private String description;
    private Integer experienceRequired;
    private String salaryRange;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

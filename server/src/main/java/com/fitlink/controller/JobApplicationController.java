package com.fitlink.controller;

import com.fitlink.dto.ApiResponse;
import com.fitlink.dto.application.ApplyJobRequest;
import com.fitlink.dto.application.JobApplicationResponse;
import com.fitlink.service.JobApplicationService;
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
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:4200")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> applyJob(
            @RequestAttribute("userId") UUID trainerId,
            @Valid @RequestBody ApplyJobRequest request) {
        log.info("POST /api/applications/apply - Trainer {} applying for job {}", trainerId, request.getJobId());
        JobApplicationResponse response = jobApplicationService.applyJob(trainerId, request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Application submitted successfully", response),
                HttpStatus.CREATED);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<ApiResponse<Page<JobApplicationResponse>>> getMyApplications(
            @RequestAttribute("userId") UUID trainerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("GET /api/applications/my-applications - Fetching applications for trainer: {}", trainerId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        Page<JobApplicationResponse> response = jobApplicationService.getApplicationsByTrainer(trainerId, pageable);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Applications fetched successfully", response),
                HttpStatus.OK);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<Page<JobApplicationResponse>>> getJobApplications(
            @PathVariable UUID jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("GET /api/applications/job/{} - Fetching applications for job", jobId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        Page<JobApplicationResponse> response = jobApplicationService.getApplicationsByJob(jobId, pageable);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Applications fetched successfully", response),
                HttpStatus.OK);
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> updateApplicationStatus(
            @PathVariable UUID applicationId,
            @RequestParam String status) {
        log.info("PATCH /api/applications/{}/status - Updating status to: {}", applicationId, status);
        JobApplicationResponse response = jobApplicationService.updateApplicationStatus(applicationId, status);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Application status updated successfully", response),
                HttpStatus.OK);
    }
}

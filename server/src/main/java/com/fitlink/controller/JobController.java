package com.fitlink.controller;

import com.fitlink.dto.ApiResponse;
import com.fitlink.dto.job.CreateJobRequest;
import com.fitlink.dto.job.JobResponse;
import com.fitlink.service.JobService;
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
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:4200")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @RequestAttribute("userId") UUID userId,
            @Valid @RequestBody CreateJobRequest request) {
        log.info("POST /api/jobs - Creating job for gym: {}", userId);
        JobResponse response = jobService.createJob(userId, request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Job posted successfully", response),
                HttpStatus.CREATED);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> getJob(@PathVariable UUID jobId) {
        log.info("GET /api/jobs/{} - Fetching job", jobId);
        JobResponse response = jobService.getJob(jobId);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Job fetched successfully", response),
                HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        log.info("GET /api/jobs - Fetching all open jobs, page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<JobResponse> response = jobService.getAllOpenJobs(pageable);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Jobs fetched successfully", response),
                HttpStatus.OK);
    }

    @GetMapping("/gym/{gymId}")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getJobsByGym(
            @PathVariable UUID gymId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("GET /api/jobs/gym/{} - Fetching jobs for gym", gymId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<JobResponse> response = jobService.getJobsByGym(gymId, pageable);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Jobs fetched successfully", response),
                HttpStatus.OK);
    }

    @PatchMapping("/{jobId}/status")
    public ResponseEntity<ApiResponse<JobResponse>> updateJobStatus(
            @PathVariable UUID jobId,
            @RequestParam String status) {
        log.info("PATCH /api/jobs/{}/status - Updating job status to: {}", jobId, status);
        JobResponse response = jobService.updateJobStatus(jobId, status);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Job status updated successfully", response),
                HttpStatus.OK);
    }
}

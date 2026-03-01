package com.fitlink.service;

import com.fitlink.dto.job.CreateJobRequest;
import com.fitlink.dto.job.JobResponse;
import com.fitlink.entity.Job;
import com.fitlink.entity.JobStatus;
import com.fitlink.entity.User;
import com.fitlink.entity.UserRole;
import com.fitlink.exception.BadRequestException;
import com.fitlink.exception.ResourceNotFoundException;
import com.fitlink.repository.JobRepository;
import com.fitlink.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public JobResponse createJob(UUID gymId, CreateJobRequest request) {
        log.info("Creating job for gym: {}", gymId);

        User gym = userRepository.findById(gymId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym not found"));

        if (!gym.getRole().equals(UserRole.GYM)) {
            throw new BadRequestException("Only gyms can post jobs");
        }

        Job job = new Job();
        job.setGym(gym);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setSalaryRange(request.getSalaryRange());
        job.setStatus(JobStatus.OPEN);
        job.setCreatedAt(LocalDateTime.now());

        jobRepository.save(job);

        return mapToResponse(job);
    }

    public JobResponse getJob(UUID jobId) {
        log.info("Fetching job: {}", jobId);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        return mapToResponse(job);
    }

    public Page<JobResponse> getAllOpenJobs(Pageable pageable) {
        log.info("Fetching all open jobs");

        Page<Job> jobs = jobRepository.findByStatus(JobStatus.OPEN, pageable);
        return jobs.map(this::mapToResponse);
    }

    public Page<JobResponse> getJobsByGym(UUID gymId, Pageable pageable) {
        log.info("Fetching jobs for gym: {}", gymId);

        User gym = userRepository.findById(gymId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym not found"));

        return jobRepository.findByGymId(gymId, pageable)
                .map(this::mapToResponse);
    }

    public JobResponse updateJobStatus(UUID jobId, String status) {
        log.info("Updating job status: {}", jobId);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        try {
            job.setStatus(JobStatus.valueOf(status.toUpperCase()));
            job.setUpdatedAt(LocalDateTime.now());
            jobRepository.save(job);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid job status");
        }

        return mapToResponse(job);
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .gymId(job.getGym().getId())
                .gymName(job.getGym().getName())
                .title(job.getTitle())
                .description(job.getDescription())
                .experienceRequired(job.getExperienceRequired())
                .salaryRange(job.getSalaryRange())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}

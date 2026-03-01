package com.fitlink.service;

import com.fitlink.dto.application.ApplyJobRequest;
import com.fitlink.dto.application.JobApplicationResponse;
import com.fitlink.entity.ApplicationStatus;
import com.fitlink.entity.Job;
import com.fitlink.entity.JobApplication;
import com.fitlink.entity.User;
import com.fitlink.entity.UserRole;
import com.fitlink.exception.BadRequestException;
import com.fitlink.exception.ResourceNotFoundException;
import com.fitlink.repository.JobApplicationRepository;
import com.fitlink.repository.JobRepository;
import com.fitlink.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public JobApplicationResponse applyJob(UUID trainerId, ApplyJobRequest request) {
        log.info("Trainer {} applying for job {}", trainerId, request.getJobId());

        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

        if (!trainer.getRole().equals(UserRole.TRAINER)) {
            throw new BadRequestException("Only trainers can apply for jobs");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (jobApplicationRepository.findByJobIdAndTrainerId(request.getJobId(), trainerId).isPresent()) {
            throw new BadRequestException("You have already applied for this job");
        }

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setTrainer(trainer);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedAt(LocalDateTime.now());

        jobApplicationRepository.save(application);

        return mapToResponse(application);
    }

    public Page<JobApplicationResponse> getApplicationsByTrainer(UUID trainerId, Pageable pageable) {
        log.info("Fetching applications for trainer: {}", trainerId);

        return jobApplicationRepository.findByTrainerId(trainerId, pageable)
                .map(this::mapToResponse);
    }

    public Page<JobApplicationResponse> getApplicationsByJob(UUID jobId, Pageable pageable) {
        log.info("Fetching applications for job: {}", jobId);

        return jobApplicationRepository.findByJobId(jobId, pageable)
                .map(this::mapToResponse);
    }

    public JobApplicationResponse updateApplicationStatus(UUID applicationId, String status) {
        log.info("Updating application status: {}", applicationId);

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        try {
            application.setStatus(ApplicationStatus.valueOf(status.toUpperCase()));
            application.setUpdatedAt(LocalDateTime.now());
            jobApplicationRepository.save(application);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid application status");
        }

        return mapToResponse(application);
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .trainerId(application.getTrainer().getId())
                .trainerName(application.getTrainer().getName())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}

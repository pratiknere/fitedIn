package com.fitlink.repository;

import com.fitlink.entity.Job;
import com.fitlink.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
    Page<Job> findByGymId(UUID gymId, Pageable pageable);
    List<Job> findByGymIdAndStatus(UUID gymId, JobStatus status);
}

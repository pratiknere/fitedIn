package com.fitlink.repository;

import com.fitlink.entity.Achievement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
    Page<Achievement> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Achievement> findByTrainerIdOrderByCreatedAtDesc(UUID trainerId, Pageable pageable);
}

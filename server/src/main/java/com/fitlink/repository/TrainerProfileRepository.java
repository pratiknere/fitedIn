package com.fitlink.repository;

import com.fitlink.entity.TrainerProfile;
import com.fitlink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, UUID> {
    Optional<TrainerProfile> findByUser(User user);
    Optional<TrainerProfile> findByUserId(UUID userId);
}

package com.fitlink.repository;

import com.fitlink.entity.GymProfile;
import com.fitlink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GymProfileRepository extends JpaRepository<GymProfile, UUID> {
    Optional<GymProfile> findByUser(User user);
    Optional<GymProfile> findByUserId(UUID userId);
}

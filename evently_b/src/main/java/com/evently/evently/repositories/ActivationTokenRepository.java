package com.evently.evently.repositories;

import com.evently.evently.entities.ActivationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivationTokenRepository extends JpaRepository<ActivationToken, String> {
    Optional<ActivationToken> findByToken(String token);
}
package com.evently.evently.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record EventRegistrationResponseDTO(Long id, Long eventId, UUID userId, LocalDateTime registrationDate) {

}

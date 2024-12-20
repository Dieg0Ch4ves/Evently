package com.evently.evently.dtos;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record EventResponseDTO(
        Long id,
        String title,
        String description,
        LocalDateTime dateEvent,
        String localEvent,
        Long capacity,
        String image,
        Set<EventRegistrationResponseDTO> registrations,
        LocalDateTime createdDate,
        UUID createdBy) {

}

package com.evently.evently.dtos;

import java.util.List;
import java.util.UUID;

import com.evently.evently.entities.UserRole;

public record UserResponseDTO(UUID id, String name, String email, UserRole role,
    List<EventRegistrationResponseDTO> registrations) {

}

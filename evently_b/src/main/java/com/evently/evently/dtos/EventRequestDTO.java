package com.evently.evently.dtos;

import java.time.LocalDateTime;
import java.util.Set;

import com.evently.evently.entities.EventRegistration;

public record EventRequestDTO(
    String title,
    String description,
    LocalDateTime dateEvent,
    String localEvent,
    Long capacity,
    String image,
    Set<EventRegistration> registrations,
    LocalDateTime createdDate) {

}

package com.evently.evently.service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.evently.evently.dtos.EventRegistrationResponseDTO;
import com.evently.evently.dtos.EventRequestDTO;
import com.evently.evently.dtos.EventResponseDTO;
import com.evently.evently.entities.Event;
import com.evently.evently.entities.User;
import com.evently.evently.repositories.EventRepository;
import com.evently.evently.repositories.UserRepository;

@Service
public class EventService {

  private final UserRepository userRepository;

  private final EventRepository eventRepository;

  public EventService(UserRepository userRepository, EventRepository eventRepository) {
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
  }

  public List<EventResponseDTO> getAllEvents() {
    return eventRepository.findAllWithRegistrations().stream()
        .map(this::toResponseDTO)
        .collect(Collectors.toList());
  }

  public EventResponseDTO getEventById(Long id) {
    Event event = eventRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado com este ID: " + id));
    return toResponseDTO(event);
  }

  public EventResponseDTO createEvent(UUID id, EventRequestDTO eventRequestDTO) throws Exception {
    User currentUser = userRepository.findById(id).orElse(null);
    if (currentUser == null) {
      throw new Exception("Este usuário não foi encontrado!");
    }

    Event event = new Event();
    event.setTitle(eventRequestDTO.title());
    event.setDescription(eventRequestDTO.description());
    event.setDateEvent(eventRequestDTO.dateEvent());
    event.setLocalEvent(eventRequestDTO.localEvent());
    event.setCapacity(eventRequestDTO.capacity());

    String image = eventRequestDTO.image();

    if (image != null) {
      try {
        byte[] imageConverted = Base64.getDecoder().decode(image);
        event.setImage(imageConverted);
      } catch (Exception e) {
        System.err.println("Erro ao tentar converter para Base64: " + e);
      }
    } else {
      event.setImage(null);
    }

    event.setCreatedDate(LocalDateTime.now());
    event.setCreatedBy(currentUser);

    Event savedEvent = eventRepository.save(event);
    return toResponseDTO(savedEvent);
  }

  public EventResponseDTO updateEvent(Long id, EventRequestDTO eventRequestDTO) {
    Event event = eventRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + id));

    event.setTitle(eventRequestDTO.title());
    event.setDescription(eventRequestDTO.description());
    event.setDateEvent(eventRequestDTO.dateEvent());
    event.setLocalEvent(eventRequestDTO.localEvent());
    event.setCapacity(eventRequestDTO.capacity());

    String image = eventRequestDTO.image();

    if (image != null) {
      try {
        byte[] imageConverted = Base64.getDecoder().decode(image);
        event.setImage(imageConverted);
      } catch (Exception e) {
        System.err.println("Erro ao tentar converter para Base64: " + e);
      }
    } else {
      event.setImage(null);
    }

    Event updatedEvent = eventRepository.save(event);
    return toResponseDTO(updatedEvent);
  }

  public void deleteEvent(Long id) {
    Event event = eventRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + id));
    eventRepository.delete(event);
  }

  private EventResponseDTO toResponseDTO(Event event) {
    Set<EventRegistrationResponseDTO> registrationDTOs = event.getRegistrations().stream()
        .map(registration -> new EventRegistrationResponseDTO(
            registration.getId(),
            registration.getEvent().getId(),
            registration.getUser().getId(),
            registration.getRegistrationDate()))
        .collect(Collectors.toSet());

    return new EventResponseDTO(
        event.getId(),
        event.getTitle(),
        event.getDescription(),
        event.getDateEvent(),
        event.getLocalEvent(),
        event.getCapacity(),
        event.getImage() != null ? Base64.getEncoder().encodeToString(event.getImage()) : null,
        registrationDTOs,
        event.getCreatedDate(),
        event.getCreatedBy().getId());
  }

}

package com.evently.evently.service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.evently.evently.dtos.EventRequestDTO;
import com.evently.evently.dtos.EventResponseDTO;
import com.evently.evently.entities.Event;
import com.evently.evently.repositories.EventRepository;

@Service
public class EventService {

  private final EventRepository eventRepository;

  public EventService(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
  }

  public List<EventResponseDTO> getAllEvents() {
    return eventRepository.findAll().stream()
        .map(this::toResponseDTO)
        .collect(Collectors.toList());
  }

  public EventResponseDTO getEventById(Long id) {
    Event event = eventRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + id));
    return toResponseDTO(event);
  }

  public EventResponseDTO createEvent(EventRequestDTO eventRequestDTO) {
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
    EventResponseDTO dto = new EventResponseDTO(event.getId(), event.getTitle(), event.getDescription(),
        event.getDateEvent(), event.getLocalEvent(), event.getCapacity(), event.getDescription(),
        event.getRegistrations(), event.getCreatedDate());
    return dto;
  }
}

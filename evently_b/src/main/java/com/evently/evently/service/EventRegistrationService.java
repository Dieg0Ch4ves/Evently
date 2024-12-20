package com.evently.evently.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.evently.evently.dtos.EventRegistrationResponseDTO;
import com.evently.evently.entities.Event;
import com.evently.evently.entities.EventRegistration;
import com.evently.evently.entities.User;
import com.evently.evently.exceptions.UserAlreadyRegisteredException;
import com.evently.evently.repositories.EventRegistrationRepository;
import com.evently.evently.repositories.EventRepository;
import com.evently.evently.repositories.UserRepository;

@Service
public class EventRegistrationService {

  @Autowired
  private EventRegistrationRepository eventRegistrationRepository;

  @Autowired
  private EventRepository eventRepository;

  @Autowired
  private UserRepository userRepository;

  @Transactional
  public EventRegistrationResponseDTO registerForEvent(Long eventId, UUID userId) {
    Optional<Event> eventOpt = eventRepository.findById(eventId);
    Optional<User> userOpt = userRepository.findById(userId);

    if (eventOpt.isEmpty() || userOpt.isEmpty()) {
      throw new IllegalArgumentException("Evento ou usuário não encontrado!");
    }

    Event event = eventOpt.get();
    User user = userOpt.get();

    if (eventRegistrationRepository.findByUserAndEvent(user, event) != null) {
      throw new UserAlreadyRegisteredException("O usuário já se inscreveu neste evento!");
    }

    EventRegistration registration = new EventRegistration();
    registration.setEvent(event);
    registration.setUser(user);
    EventRegistration savedEventRegistration = eventRegistrationRepository.save(registration);

    return new EventRegistrationResponseDTO(savedEventRegistration.getId(), savedEventRegistration.getEvent().getId(),
        savedEventRegistration.getUser().getId(), savedEventRegistration.getRegistrationDate());
  }

  @Transactional
  public void unregisterFromEvent(Long registrationId) {
    if (!eventRegistrationRepository.existsById(registrationId)) {
      throw new IllegalArgumentException("Inscrição não encontrada!");
    }

    eventRegistrationRepository.deleteById(registrationId);
  }
}

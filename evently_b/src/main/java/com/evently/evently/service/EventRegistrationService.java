package com.evently.evently.service;

import com.evently.evently.dtos.EventRegistrationResponseDTO;
import com.evently.evently.entities.Event;
import com.evently.evently.entities.EventRegistration;
import com.evently.evently.entities.User;
import com.evently.evently.exceptions.UserAlreadyRegisteredException;
import com.evently.evently.repositories.EventRegistrationRepository;
import com.evently.evently.repositories.EventRepository;
import com.evently.evently.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class EventRegistrationService {

    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventRegistrationService(EventRegistrationRepository eventRegistrationRepository,
                                    EventRepository eventRepository,
                                    UserRepository userRepository) {
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }


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
    public void unregisterFromEvent(Long eventId, UUID userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado com este ID: " + eventId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com este ID: " + userId));
        EventRegistration registration = eventRegistrationRepository.findByUserAndEvent(user, event);
        if (registration != null) {
            event.getRegistrations().remove(registration);
            user.getRegistrations().remove(registration);

            eventRegistrationRepository.delete(registration);
        } else {
            throw new IllegalArgumentException("Registro de evento não encontrado para o usuário e evento fornecidos.");
        }
    }
}

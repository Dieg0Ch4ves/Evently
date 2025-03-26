package com.evently.evently.service;

import com.evently.evently.dtos.EventRegistrationResponseDTO;
import com.evently.evently.entities.Event;
import com.evently.evently.entities.EventRegistration;
import com.evently.evently.entities.User;
import com.evently.evently.exceptions.UserAlreadyRegisteredException;
import com.evently.evently.repositories.EventRegistrationRepository;
import com.evently.evently.repositories.EventRepository;
import com.evently.evently.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventRegistrationServiceTest {

    @Mock
    private EventRegistrationRepository eventRegistrationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EventRegistrationService eventRegistrationService;

    private Event event;
    private User user;
    private EventRegistration eventRegistration;
    private Long eventId = 1L;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        event = new Event();
        event.setId(eventId);

        user = new User();
        user.setId(userId);

        eventRegistration = new EventRegistration();
        eventRegistration.setId(100L);
        eventRegistration.setEvent(event);
        eventRegistration.setUser(user);
        eventRegistration.setRegistrationDate(LocalDateTime.now());
    }

    @Test
    void testRegisterForEvent_Success() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(eventRegistrationRepository.findByUserAndEvent(user, event)).thenReturn(null);
        when(eventRegistrationRepository.save(any(EventRegistration.class))).thenReturn(eventRegistration);

        EventRegistrationResponseDTO response = eventRegistrationService.registerForEvent(eventId, userId);

        assertNotNull(response);
        assertEquals(eventRegistration.getId(), response.id());
        assertEquals(eventId, response.eventId());
        assertEquals(userId, response.userId());
        verify(eventRegistrationRepository, times(1)).save(any(EventRegistration.class));
    }

    @Test
    void testRegisterForEvent_UserAlreadyRegistered() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(eventRegistrationRepository.findByUserAndEvent(user, event)).thenReturn(eventRegistration);

        assertThrows(UserAlreadyRegisteredException.class, () ->
                eventRegistrationService.registerForEvent(eventId, userId));
    }

    @Test
    void testRegisterForEvent_EventOrUserNotFound() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                eventRegistrationService.registerForEvent(eventId, userId));
    }

    @Test
    void testUnregisterFromEvent_Success() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(eventRegistrationRepository.findByUserAndEvent(user, event)).thenReturn(eventRegistration);

        eventRegistrationService.unregisterFromEvent(eventId, userId);

        verify(eventRegistrationRepository, times(1)).delete(eventRegistration);
    }

    @Test
    void testUnregisterFromEvent_EventOrUserNotFound() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                eventRegistrationService.unregisterFromEvent(eventId, userId));
    }

    @Test
    void testUnregisterFromEvent_RegistrationNotFound() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(eventRegistrationRepository.findByUserAndEvent(user, event)).thenReturn(null);

        assertThrows(IllegalArgumentException.class, () ->
                eventRegistrationService.unregisterFromEvent(eventId, userId));
    }
}

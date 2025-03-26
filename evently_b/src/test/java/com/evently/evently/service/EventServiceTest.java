package com.evently.evently.service;

import com.evently.evently.dtos.EventRequestDTO;
import com.evently.evently.dtos.EventResponseDTO;
import com.evently.evently.entities.Event;
import com.evently.evently.entities.EventRegistration;
import com.evently.evently.entities.User;
import com.evently.evently.repositories.EventRepository;
import com.evently.evently.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private Event event;
    private User user;
    private Long eventId = 1L;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);

        event = new Event();
        event.setId(eventId);
        event.setTitle("Tech Conference");
        event.setDescription("An amazing tech event");
        event.setDateEvent(LocalDateTime.now().plusDays(10));
        event.setLocalEvent("New York");
        event.setCapacity(200L);
        event.setCreatedDate(LocalDateTime.now());
        event.setCreatedBy(user);
    }

    @Test
    void testGetAllEvents() {
        when(eventRepository.findAllWithRegistrations()).thenReturn(Collections.singletonList(event));

        List<EventResponseDTO> events = eventService.getAllEvents();

        assertNotNull(events);
        assertEquals(1, events.size());
        assertEquals(event.getTitle(), events.get(0).title());
    }

    @Test
    void testGetEventById_Success() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        EventResponseDTO response = eventService.getEventById(eventId);

        assertNotNull(response);
        assertEquals(event.getId(), response.id());
    }

    @Test
    void testGetEventById_NotFound() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> eventService.getEventById(eventId));
    }

    @Test
    void testCreateEvent_Success() throws Exception {
        EventRequestDTO requestDTO = new EventRequestDTO("Tech Conference",
                "An amazing tech event",
                LocalDateTime.now().plusDays(10),
                "New York", 200L,
                null,
                Set.of(new EventRegistration()));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        EventResponseDTO response = eventService.createEvent(userId, requestDTO);

        assertNotNull(response);
        assertEquals(event.getTitle(), response.title());
    }

    @Test
    void testCreateEvent_UserNotFound() {
        EventRequestDTO requestDTO = new EventRequestDTO("Tech Conference",
                "An amazing tech event",
                LocalDateTime.now().plusDays(10),
                "New York",
                200L,
                null,
                Set.of(new EventRegistration())
        );
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> eventService.createEvent(userId, requestDTO));
    }

    @Test
    void testUpdateEvent_Success() {
        EventRequestDTO requestDTO = new EventRequestDTO("Updated Title",
                "Updated Description",
                LocalDateTime.now().plusDays(15),
                "Los Angeles",
                300L,
                null,
                Set.of(new EventRegistration()));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        EventResponseDTO response = eventService.updateEvent(eventId, requestDTO);

        assertNotNull(response);
        assertEquals(requestDTO.title(), response.title());
    }

    @Test
    void testUpdateEvent_NotFound() {
        EventRequestDTO requestDTO = new EventRequestDTO("Updated Title",
                "Updated Description",
                LocalDateTime.now().plusDays(15),
                "Los Angeles",
                300L,
                null,
                Set.of(new EventRegistration()));
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> eventService.updateEvent(eventId, requestDTO));
    }

    @Test
    void testDeleteEvent_Success() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        doNothing().when(eventRepository).delete(event);

        eventService.deleteEvent(eventId);

        verify(eventRepository, times(1)).delete(event);
    }

    @Test
    void testDeleteEvent_NotFound() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> eventService.deleteEvent(eventId));
    }
}

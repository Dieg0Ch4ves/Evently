package com.evently.evently.controllers;

import com.evently.evently.dtos.EventRegistrationResponseDTO;
import com.evently.evently.dtos.EventRequestDTO;
import com.evently.evently.dtos.EventResponseDTO;
import com.evently.evently.entities.EventRegistration;
import com.evently.evently.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    private EventResponseDTO eventResponse;
    private EventRequestDTO eventRequest;
    private UUID userId;
    private Long eventId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        eventId = 1L;
        eventResponse = new EventResponseDTO(
                1L,
                "Nome do Evento",
                "Descrição do Evento",
                LocalDateTime.now(),
                "Local do Evento",
                10L,
                "image.png",
                Set.of(new EventRegistrationResponseDTO(
                        1L,
                        2L,
                        UUID.randomUUID(),
                        LocalDateTime.now()
                )),
                LocalDateTime.now(),
                userId
        );
        eventRequest = new EventRequestDTO(
                "Nome do Evento",
                "Descrição do Evento",
                LocalDateTime.now(),
                "Local do Evento",
                10L,
                "image.png",
                Set.of(new EventRegistration())
        );
    }

    @Test
    void getAll_ShouldReturnListOfEvents() throws Exception {
        when(eventService.getAllEvents()).thenReturn(Arrays.asList(eventResponse));

        ResponseEntity<List<EventResponseDTO>> response = eventController.getAll();

        assertNotNull(response);
        assertEquals(1, response.getBody().size());
        verify(eventService, times(1)).getAllEvents();
    }

    @Test
    void getById_ShouldReturnEvent() throws Exception {
        when(eventService.getEventById(eventId)).thenReturn(eventResponse);

        ResponseEntity<EventResponseDTO> response = eventController.getById(eventId);

        assertNotNull(response);
        assertEquals(eventResponse, response.getBody());
        verify(eventService, times(1)).getEventById(eventId);
    }

    @Test
    void getByIdUser_ShouldReturnListOfEvents() throws Exception {
        when(eventService.getEventByIdUser(userId)).thenReturn(Arrays.asList(eventResponse));

        ResponseEntity<List<EventResponseDTO>> response = eventController.getByIdUser(userId);

        assertNotNull(response);
        assertEquals(1, response.getBody().size());
        verify(eventService, times(1)).getEventByIdUser(userId);
    }

    @Test
    void postEvent_ShouldCreateEvent() throws Exception {
        when(eventService.createEvent(eq(userId), any(EventRequestDTO.class))).thenReturn(eventResponse);

        ResponseEntity<EventResponseDTO> response = eventController.postEvent(userId, eventRequest);

        assertNotNull(response);
        assertEquals(eventResponse, response.getBody());
        verify(eventService, times(1)).createEvent(eq(userId), any(EventRequestDTO.class));
    }

    @Test
    void putEvent_ShouldUpdateEvent() throws Exception {
        when(eventService.updateEvent(eq(eventId), any(EventRequestDTO.class))).thenReturn(eventResponse);

        ResponseEntity<EventResponseDTO> response = eventController.putEvent(eventId, eventRequest);

        assertNotNull(response);
        assertEquals(eventResponse, response.getBody());
        verify(eventService, times(1)).updateEvent(eq(eventId), any(EventRequestDTO.class));
    }

    @Test
    void deleteEvent_ShouldDeleteEvent() {
        doNothing().when(eventService).deleteEvent(eventId);

        ResponseEntity<String> response = eventController.deleteEvent(eventId);

        assertNotNull(response);
        assertEquals("O evento foi excluido com sucesso!", response.getBody());
        verify(eventService, times(1)).deleteEvent(eventId);
    }
}

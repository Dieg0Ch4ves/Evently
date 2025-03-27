package com.evently.evently.controllers;

import com.evently.evently.dtos.EventRegistrationResponseDTO;
import com.evently.evently.service.EventRegistrationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventRegistrationControllerTest {

    @Mock
    private EventRegistrationService eventRegistrationService;

    @InjectMocks
    private EventRegistrationController eventRegistrationController;

    private EventRegistrationResponseDTO registrationResponse;
    private UUID userId;
    private Long eventId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        eventId = 1L;
        registrationResponse = new EventRegistrationResponseDTO(
                1L,
                2L,
                UUID.randomUUID(),
                LocalDateTime.now()
        );
    }

    @Test
    void registerForEvent_ShouldReturnRegistrationResponse() {
        when(eventRegistrationService.registerForEvent(eventId, userId)).thenReturn(registrationResponse);

        ResponseEntity<EventRegistrationResponseDTO> response = eventRegistrationController.registerForEvent(eventId, userId);

        assertNotNull(response);
        assertEquals(registrationResponse, response.getBody());
        verify(eventRegistrationService, times(1)).registerForEvent(eventId, userId);
    }

    @Test
    void unregisterFromEvent_ShouldReturnSuccessMessage() {
        doNothing().when(eventRegistrationService).unregisterFromEvent(eventId, userId);

        ResponseEntity<String> response = eventRegistrationController.unregisterFromEvent(eventId, userId);

        assertNotNull(response);
        assertEquals("Inscrição cancelada com sucesso!", response.getBody());
        verify(eventRegistrationService, times(1)).unregisterFromEvent(eventId, userId);
    }
}

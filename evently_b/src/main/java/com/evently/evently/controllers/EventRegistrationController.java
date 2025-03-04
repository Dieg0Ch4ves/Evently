package com.evently.evently.controllers;

import com.evently.evently.dtos.EventRegistrationResponseDTO;
import com.evently.evently.service.EventRegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/registration")
public class EventRegistrationController {

    private final EventRegistrationService eventRegistrationService;

    public EventRegistrationController(EventRegistrationService eventRegistrationService) {
        this.eventRegistrationService = eventRegistrationService;

    }

    // ================ REGISTER REQUEST ================ |

    @PostMapping("/register/{eventId}/{userId}")
    public ResponseEntity<EventRegistrationResponseDTO> registerForEvent(@PathVariable Long eventId,
                                                                         @PathVariable UUID userId) {
        EventRegistrationResponseDTO response = eventRegistrationService.registerForEvent(eventId, userId);
        return ResponseEntity.ok(response);
    }

    // ================ UNREGISTER REQUEST ================ |

    @DeleteMapping("/unregister/{eventId}/{userId}")
    public ResponseEntity<String> unregisterFromEvent(@PathVariable Long eventId,
                                                      @PathVariable UUID userId) {
        eventRegistrationService.unregisterFromEvent(eventId, userId);
        return ResponseEntity.ok("Inscrição cancelada com sucesso!");
    }

}

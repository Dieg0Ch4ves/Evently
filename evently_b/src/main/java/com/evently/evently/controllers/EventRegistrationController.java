package com.evently.evently.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evently.evently.dtos.EventRegistrationResponseDTO;
import com.evently.evently.service.EventRegistrationService;

@RestController
@RequestMapping("/registration")
public class EventRegistrationController {

  @Autowired
  private EventRegistrationService eventRegistrationService;

  // ================ REGISTER REQUEST ================ |

  @PostMapping("/register/{eventId}/{userId}")
  public ResponseEntity<EventRegistrationResponseDTO> registerForEvent(@PathVariable Long eventId,
      @PathVariable UUID userId) {
    EventRegistrationResponseDTO response = eventRegistrationService.registerForEvent(eventId, userId);
    return ResponseEntity.ok(response);
  }

  // ================ UNREGISTER REQUEST ================ |

  @DeleteMapping("/unregister/{registrationId}")
  public ResponseEntity<Void> unregisterFromEvent(@PathVariable Long registrationId) {
    eventRegistrationService.unregisterFromEvent(registrationId);
    return ResponseEntity.noContent().build();
  }

}

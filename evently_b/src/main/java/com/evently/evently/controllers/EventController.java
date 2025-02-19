package com.evently.evently.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evently.evently.dtos.EventRequestDTO;
import com.evently.evently.dtos.EventResponseDTO;
import com.evently.evently.service.EventService;

@RestController
@RequestMapping("/event")
public class EventController {

  @Autowired
  EventService service;

  // ================ GET REQUESTS ================ |

  @GetMapping("/all")
  @Transactional
  public ResponseEntity<List<EventResponseDTO>> getAll() throws Exception {
    try {
      List<EventResponseDTO> response = service.getAllEvents();
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      throw new Exception("Não foi possível buscar os eventos!");
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<EventResponseDTO> getById(@PathVariable Long id) throws Exception {
    try {
      EventResponseDTO response = service.getEventById(id);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      throw new Exception("Não foi possível buscar o evento!");
    }
  }

  @GetMapping("/get-by-user/{id}")
  public ResponseEntity<List<EventResponseDTO>> getByIdUser(@PathVariable UUID id) throws Exception {
    try {
      List<EventResponseDTO> response = service.getEventByIdUser(id);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      throw new Exception("Não foi possível buscar os eventos: " + e);
    }
  }

  // ================ POST REQUESTS ================ |

  @PostMapping("/{id}")
  public ResponseEntity<EventResponseDTO> postEvent(@PathVariable UUID id, @RequestBody EventRequestDTO request)
      throws Exception {
    try {
      EventResponseDTO response = service.createEvent(id, request);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      throw new Exception(e);
    }
  }

  // ================ PUT REQUESTS ================ |

  @PutMapping("/{id}")
  public ResponseEntity<EventResponseDTO> putEvent(@PathVariable Long id, @RequestBody EventRequestDTO request)
      throws Exception {
    try {
      EventResponseDTO response = service.updateEvent(id, request);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      throw new Exception("Não foi possível buscar o evento!");
    }
  }

  // ================ DELETE REQUESTS ================ |

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
    service.deleteEvent(id);
    return ResponseEntity.ok("O evento foi excluido com sucesso!");
  }

}
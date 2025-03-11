package com.evently.evently.controllers;

import com.evently.evently.dtos.*;
import com.evently.evently.entities.EventRegistration;
import com.evently.evently.entities.User;
import com.evently.evently.repositories.UserRepository;
import com.evently.evently.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("auth")
public class UserController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository repository;
    private final TokenService tokenService;

    public UserController(AuthenticationManager authenticationManager, UserRepository repository, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.repository = repository;
        this.tokenService = tokenService;
    }

    // End-Point de login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequestDTO data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            var user = (User) auth.getPrincipal();
            var token = tokenService.generateToken(user);

            return ResponseEntity.ok(new AuthenticationResponseDTO(token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar a requisição");
        }
    }

    // End-point de cadastro
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDTO data) {
        User existUser = repository.findByEmail(data.email()).orElse(null);

        if (existUser != null) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado!");
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User newUser = new User(data.name(), data.email(), encryptedPassword, data.role());

        this.repository.save(newUser);

        return ResponseEntity.status(201).body("Usuário cadastrado com sucesso!");
    }

    // End-point para obter o objeto do usuario através do token
    // de acesso.
    @GetMapping("/user")
    public ResponseEntity<UserResponseDTO> getUserFromToken(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String username = tokenService.validateToken(token);

        if (username.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = repository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Set<EventRegistrationResponseDTO> eventRegistrationsDTO = new HashSet<>();
        for (EventRegistration eventRegistration : user.getRegistrations()) {
            EventRegistrationResponseDTO eventRegistrationDTO = new EventRegistrationResponseDTO(eventRegistration.getId(),
                    eventRegistration.getEvent().getId(), eventRegistration.getUser().getId(),
                    eventRegistration.getRegistrationDate());
            eventRegistrationsDTO.add(eventRegistrationDTO);
        }

        return ResponseEntity
                .ok(new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), eventRegistrationsDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable UUID id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Set<EventRegistrationResponseDTO> eventRegistrationsDTO = new HashSet<>();
        for (EventRegistration eventRegistration : user.getRegistrations()) {
            EventRegistrationResponseDTO eventRegistrationDTO = new EventRegistrationResponseDTO(eventRegistration.getId(),
                    eventRegistration.getEvent().getId(), eventRegistration.getUser().getId(),
                    eventRegistration.getRegistrationDate());
            eventRegistrationsDTO.add(eventRegistrationDTO);
        }

        return ResponseEntity
                .ok(new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), eventRegistrationsDTO));
    }

   @GetMapping("/all")
   public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
       List<User> users = repository.findAll();
       List<UserResponseDTO> userResponseDTOs = users.stream().map(user -> {
           Set<EventRegistrationResponseDTO> eventRegistrationsDTO = new HashSet<>();
           for (EventRegistration eventRegistration : user.getRegistrations()) {
               EventRegistrationResponseDTO eventRegistrationDTO = new EventRegistrationResponseDTO(eventRegistration.getId(),
                       eventRegistration.getEvent().getId(), eventRegistration.getUser().getId(),
                       eventRegistration.getRegistrationDate());
               eventRegistrationsDTO.add(eventRegistrationDTO);
           }
           return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), eventRegistrationsDTO);
       }).toList();

       return ResponseEntity.ok(userResponseDTOs);
   }

    // Metodo de extração de token
    private String extractTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7); // Remove "Bearer " from the header
        }
        return null;
    }
}

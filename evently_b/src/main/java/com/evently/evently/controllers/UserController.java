package com.evently.evently.controllers;

import com.evently.evently.dtos.*;
import com.evently.evently.entities.ActivationToken;
import com.evently.evently.entities.EventRegistration;
import com.evently.evently.entities.User;
import com.evently.evently.exceptions.UserNotActiveException;
import com.evently.evently.exceptions.UserNotFoundException;
import com.evently.evently.repositories.ActivationTokenRepository;
import com.evently.evently.repositories.UserRepository;
import com.evently.evently.service.EmailService;
import com.evently.evently.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
    private final ActivationTokenRepository activationTokenRepository;
    private final EmailService emailService;

    private static final String KEY_USER_NOT_FOUND = "Usuário não encontrado.";

    @Value("${frontend.url}")
    private String frontUrl;

    public UserController(AuthenticationManager authenticationManager,
                          UserRepository repository, TokenService tokenService,
                          ActivationTokenRepository activationTokenRepository,
                          EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.repository = repository;
        this.tokenService = tokenService;
        this.activationTokenRepository = activationTokenRepository;
        this.emailService = emailService;
    }

    // End-Point de login
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@RequestBody AuthenticationRequestDTO data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            var user = (User) auth.getPrincipal();

            if (Boolean.FALSE.equals(user.getActive())) {
                throw new UserNotActiveException("Usuário não está ativo");
            }

            var token = tokenService.generateToken(user);

            return ResponseEntity.ok(new AuthenticationResponseDTO(token));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Usuário ou senha inválidos");
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
        newUser.setActive(false);

        this.repository.save(newUser);

        // Criar token de ativação
        String activationToken = UUID.randomUUID().toString();
        ActivationToken tokenEntity = new ActivationToken(newUser, activationToken, LocalDateTime.now().plusHours(24));

        activationTokenRepository.save(tokenEntity);

        // Enviar e-mail de ativação
        String activationLink = frontUrl + "/activate?token=" + activationToken;
        emailService.sendActivationEmail(newUser.getEmail(), activationLink);

        return ResponseEntity.status(201).body("Usuário cadastrado com sucesso! Verifique seu e-mail para ativação.");
    }


    @PatchMapping("/activate")
    public ResponseEntity<String> activateUser(@RequestParam("token") String token) {
        ActivationToken activationToken = activationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido ou expirado"));

        if (activationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token expirado. Solicite um novo.");
        }

        User user = activationToken.getUser();
        if (Boolean.TRUE.equals(user.getActive())) {
            return ResponseEntity.ok("Usuário já está ativo.");
        }

        user.setActive(true);
        repository.save(user);

        activationTokenRepository.delete(activationToken);

        return ResponseEntity.ok("Usuário ativado com sucesso!");
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
                .orElseThrow(() -> new UserNotFoundException(KEY_USER_NOT_FOUND));
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
                .orElseThrow(() -> new UserNotFoundException(KEY_USER_NOT_FOUND));
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

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable UUID id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(KEY_USER_NOT_FOUND));

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        repository.delete(user);
        return ResponseEntity.ok("Usuário deletado com sucesso!");
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

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequestDTO data) {
        User user = repository.findByEmail(data.email())
                .orElseThrow(() -> new UserNotFoundException(KEY_USER_NOT_FOUND));

        // Criar token de recuperação de senha
        String resetToken = UUID.randomUUID().toString();
        ActivationToken tokenEntity = new ActivationToken(user, resetToken, LocalDateTime.now().plusHours(24));

        activationTokenRepository.save(tokenEntity);

        // Enviar e-mail de recuperação de senha
        String resetLink = frontUrl + "/reset-password?token=" + resetToken;
        emailService.sendResetPasswordEmail(user.getEmail(), resetLink);

        return ResponseEntity.ok("E-mail de recuperação de senha enviado com sucesso!");
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

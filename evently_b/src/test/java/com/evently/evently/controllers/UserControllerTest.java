package com.evently.evently.controllers;

import com.evently.evently.dtos.AuthenticationRequestDTO;
import com.evently.evently.dtos.AuthenticationResponseDTO;
import com.evently.evently.dtos.UserResponseDTO;
import com.evently.evently.entities.User;
import com.evently.evently.entities.UserRole;
import com.evently.evently.exceptions.UserNotFoundException;
import com.evently.evently.repositories.UserRepository;
import com.evently.evently.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private UserController userController;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User(
                "Test User",
                "test@example.com",
                new BCryptPasswordEncoder().encode("password"),
                UserRole.USER
        );
        mockUser.setId(UUID.randomUUID());
    }

    @Test
    void login_ShouldAuthenticateAndReturnToken() {
        AuthenticationRequestDTO authRequest = new AuthenticationRequestDTO(mockUser.getEmail(), "password");

        // Criando um objeto de autenticação com o mockUser como principal
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(mockUser, "password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authToken);
        when(tokenService.generateToken(any())).thenReturn("mock-token");

        ResponseEntity<AuthenticationResponseDTO> response = userController.login(authRequest);

        assertNotNull(response.getBody());
        assertEquals("mock-token", response.getBody().token());
    }


    @Test
    void getUserFromToken_ShouldReturnUserDetails() {
        String token = "valid-token";
        String email = mockUser.getEmail();
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(tokenService.validateToken(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));

        ResponseEntity<UserResponseDTO> response = userController.getUserFromToken(request);

        assertNotNull(response.getBody());
        assertEquals(email, response.getBody().email());
    }

    @Test
    void getUserById_ShouldReturnUserDetails() {
        UUID userId = mockUser.getId();
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        ResponseEntity<UserResponseDTO> response = userController.getUserById(userId);

        assertNotNull(response.getBody());
        assertEquals(mockUser.getEmail(), response.getBody().email());
    }

    @Test
    void getUserById_ShouldThrowExceptionWhenUserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userController.getUserById(userId));
    }
}

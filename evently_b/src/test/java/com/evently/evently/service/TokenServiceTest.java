package com.evently.evently.service;

import com.evently.evently.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    @InjectMocks
    private TokenService tokenService;

    private final String secret = "my-secret-key";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(tokenService, "secret", secret);
    }

    @Test
    void generateToken_ShouldReturnValidToken() {
        User user = new User();
        user.setEmail("test@example.com");

        String token = tokenService.generateToken(user);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void generateToken_ShouldThrowException_WhenErrorOccurs() {
        ReflectionTestUtils.setField(tokenService, "secret", null);
        User user = new User();
        user.setEmail("test@example.com");

        assertThrows(RuntimeException.class, () -> tokenService.generateToken(user));
    }

    @Test
    void validateToken_ShouldReturnEmail_WhenTokenIsValid() {
        User user = new User();
        user.setEmail("test@example.com");
        String token = tokenService.generateToken(user);

        String subject = tokenService.validateToken(token);
        assertEquals("test@example.com", subject);
    }

    @Test
    void validateToken_ShouldReturnEmptyString_WhenTokenIsInvalid() {
        String invalidToken = "invalid.token.value";

        String subject = tokenService.validateToken(invalidToken);
        assertEquals("", subject);
    }
}

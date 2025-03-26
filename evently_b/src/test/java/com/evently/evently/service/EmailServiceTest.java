package com.evently.evently.service;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void testSendActivationEmail_Success() throws Exception {
        // Arrange
        String to = "test@example.com";
        String activationLink = "http://example.com/activate";

        // Act
        emailService.sendActivationEmail(to, activationLink);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testSendActivationEmail_Failure() throws Exception {
        // Arrange
        String to = "test@example.com";
        String activationLink = "http://example.com/activate";
        doThrow(new MailSendException("Erro ao enviar e-mail")).when(mailSender).send(mimeMessage);

        // Act & Assert
        assertThrows(MailSendException.class, () -> emailService.sendActivationEmail(to, activationLink));
    }

    @Test
    void testSendResetPasswordEmail_Success() throws Exception {
        // Arrange
        String to = "test@example.com";
        String resetLink = "http://example.com/reset";

        // Act
        emailService.sendResetPasswordEmail(to, resetLink);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testSendResetPasswordEmail_Failure() {
        // Arrange
        String to = "test@example.com";
        String resetLink = "http://example.com/reset";
        doThrow(new MailSendException("Erro ao enviar e-mail")).when(mailSender).send(mimeMessage);

        // Act & Assert
        assertThrows(MailSendException.class, () -> emailService.sendResetPasswordEmail(to, resetLink));
    }
}

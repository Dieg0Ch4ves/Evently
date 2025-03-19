package com.evently.evently.service;


import com.evently.evently.exceptions.EmailSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendActivationEmail(String to, String activationLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Ativação de Conta");
            helper.setText("<p>Clique no link abaixo para ativar sua conta:</p>" +
                    "<a href='" + activationLink + "'>Ativar Conta</a>", true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailSendException("Erro ao enviar e-mail de ativação");
        }
    }

    public void sendResetPasswordEmail(String to, String resetLink ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Redefinição de Senha");
            helper.setText("<p>Clique no link abaixo para você definir uma nova senha:</p>" +
                    "<a href='" + resetLink + "'>Acessar</a>", true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailSendException("Erro ao enviar e-mail de redefinição de senha");
        }
    }

}

package com.evently.evently.dtos;

public record ResetPasswordRequestDTO(String token, String newPassword) {
}

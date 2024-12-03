package com.evently.evently.dtos;

import com.evently.evently.entities.UserRole;

public record RegisterRequestDTO(String name, String email, String password, UserRole role) {

}

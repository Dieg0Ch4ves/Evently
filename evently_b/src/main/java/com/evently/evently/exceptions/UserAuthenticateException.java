package com.evently.evently.exceptions;

public class UserAuthenticateException extends RuntimeException {
    public UserAuthenticateException(String message) {
        super(message);
    }
}

package com.evently.evently.exceptions;

public class UserAlreadyRegisteredException extends RuntimeException {
  public UserAlreadyRegisteredException(String message) {
    super(message);
  }
}

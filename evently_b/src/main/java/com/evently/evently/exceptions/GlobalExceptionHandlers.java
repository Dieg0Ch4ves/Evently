package com.evently.evently.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandlers {

  @ExceptionHandler(UserAuthenticateException.class)
  public ResponseEntity<Map<String, Object>> handleUserAuthenticateException(UserAuthenticateException ex) {
    return buildErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(UserNotActiveException.class)
  public ResponseEntity<Map<String, Object>> handleUserNotActiveException(UserNotActiveException ex) {
    return buildErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
    return buildErrorResponse("Ocorreu um erro interno.", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private ResponseEntity<Map<String, Object>> buildErrorResponse(String message, HttpStatus status) {
    Map<String, Object> errorDetails = new HashMap<>();
    errorDetails.put("message", message);
    errorDetails.put("error", status.getReasonPhrase());
    errorDetails.put("status", status.value());

    return new ResponseEntity<>(errorDetails, status);
  }
}

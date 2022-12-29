package com.example.backend.exception;

public class ValidationException extends Exception {
    public ValidationException(String message) {
        super(message);
    }
}

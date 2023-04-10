package com.claim.api.exception;

public class BadRequestException extends RuntimeException {

    private String sourceException;

    public BadRequestException(String sourceException) {
        super(sourceException);
    }
}

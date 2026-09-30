package com.example.migration.exception;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(String id) {
        super("Customer not found: " + id);
    }
}

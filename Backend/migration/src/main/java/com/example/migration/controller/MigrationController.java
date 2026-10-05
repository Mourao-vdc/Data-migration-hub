package com.example.migration.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.migration.model.Customer;
import com.example.migration.model.LegacyCustomerA;
import com.example.migration.model.LegacyCustomerB;
import com.example.migration.service.MigrationService;

@RestController
@RequestMapping("/api/migrations/customers")
public class MigrationController {

    private final MigrationService migrationService;

    public MigrationController(MigrationService migrationService) {
        this.migrationService = migrationService;
    }

    @PostMapping("/source-a")
    public Customer migrateSourceA(
            @RequestBody LegacyCustomerA legacyCustomerA) {

        return migrationService.migrateFromSourceA(legacyCustomerA);
    }

    @PostMapping("/source-b")
    public Customer migrateSourceB(
            @RequestBody LegacyCustomerB legacyCustomerB) {

        return migrationService.migrateFromSourceB(legacyCustomerB);
    }
}
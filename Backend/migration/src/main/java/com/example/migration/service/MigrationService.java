package com.example.migration.service;

import org.springframework.stereotype.Service;

import com.example.migration.model.Customer;
import com.example.migration.model.LegacyCustomerA;
import com.example.migration.model.LegacyCustomerB;
import com.example.migration.repository.CustomerRepository;

@Service
public class MigrationService {

    private final CustomerRepository customerRepository;

    public MigrationService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer migrateFromSourceA(LegacyCustomerA legacy) {

        Customer customer = new Customer();

        String[] name = legacy.getFullName().split(" ", 2);

        customer.setFirstName(name[0]);
        customer.setLastName(name.length > 1 ? name[1] : "");
        customer.setEmail(legacy.getEmailAddress());

        return customerRepository.save(customer);
    }

    public Customer migrateFromSourceB(LegacyCustomerB legacy) {

        Customer customer = new Customer();

        customer.setFirstName(legacy.getFirstName());
        customer.setLastName(legacy.getSurname());
        customer.setEmail(legacy.getContact().getEmail());

        return customerRepository.save(customer);
    }
}
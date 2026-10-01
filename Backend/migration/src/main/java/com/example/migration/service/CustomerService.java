package com.example.migration.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.migration.exception.CustomerNotFoundException;
import com.example.migration.model.Customer;
import com.example.migration.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomer(String idCustomer) {
        Customer customer = customerRepository.findById(idCustomer)
                .orElseThrow(() -> new CustomerNotFoundException(idCustomer));

        return customer;
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(String idCustomer, Customer customer) {
        Customer existingCustomer = customerRepository.findById(idCustomer)
                .orElseThrow(() -> new CustomerNotFoundException(idCustomer));

        existingCustomer.setFirstName(customer.getFirstName());
        existingCustomer.setLastName(customer.getLastName());
        existingCustomer.setEmail(customer.getEmail());

        return customerRepository.save(existingCustomer);
    }

    public Customer deleteCustomer(String idCustomer) {
        Customer customer = customerRepository.findById(idCustomer)
                .orElseThrow(() -> new CustomerNotFoundException(idCustomer));

        customerRepository.delete(customer);

        return customer;
    }
}

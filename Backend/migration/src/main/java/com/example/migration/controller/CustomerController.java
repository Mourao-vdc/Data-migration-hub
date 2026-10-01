package com.example.migration.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.migration.model.Customer;
import com.example.migration.service.CustomerService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/customers")
public class CustomerController{

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getCustomers() {
        return customerService.getCustomers();
    }

    @GetMapping("/{idCustomer}")
    public Customer getCustomer(@PathVariable String idCustomer) {
        return customerService.getCustomer(idCustomer);
    }

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.createCustomer(customer);
    }

    @PutMapping("/{idCustomer}")
    public Customer updateCustomer(
            @PathVariable String idCustomer,
            @RequestBody Customer customer) {

        return customerService.updateCustomer(idCustomer, customer);
    }

    @DeleteMapping("/{idCustomer}")
    public Customer deleteCustomer(@PathVariable String idCustomer) {
        return customerService.deleteCustomer(idCustomer);
    }
}
# Data Migration Hub

A small data migration platform built with Java, Spring Boot, MongoDB and Angular.

## Project Goal

The goal of this project is to simulate a data migration system where data
from different sources and structures is transformed into a common model
and stored in MongoDB.

## Technologies

- Java 21
- Spring Boot
- MongoDB
- Angular
- Docker

## Architecture

```text
Different Data Sources
          |
          v
   Java / Spring Boot
          |
    Data Transformation
          |
          v
       MongoDB
          |
          v
      Angular

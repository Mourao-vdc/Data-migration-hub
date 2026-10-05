# Data Migration Hub

A small data migration platform built with Java, Spring Boot, MongoDB, Angular and Docker.

## Project Goal

The goal of this project is to simulate a data migration system where data from different sources and structures is transformed into a common model and stored in MongoDB.

The project demonstrates how heterogeneous legacy customer data can be normalized into a common `Customer` model before being persisted.

## Technologies

- Java 21
- Spring Boot
- Spring Data MongoDB
- MongoDB
- Angular
- Docker

## Architecture

```text
                    +---------------------+
                    |     Data Source A   |
                    |   LegacyCustomerA   |
                    +----------+----------+
                               |
                               |
                               v
                    +---------------------+
                    |   Spring Boot API   |
                    |                     |
                    |  Migration Service  |
                    +----------+----------+
                               |
                               | Transformation
                               v
                    +---------------------+
                    |      Customer       |
                    |    Common Model     |
                    +----------+----------+
                               |
                               v
                         +-----------+
                         |  MongoDB  |
                         +-----+-----+
                               |
                               v
                         +-----------+
                         |  Angular  |
                         |    Hub    |
                         +-----------+

                    +---------------------+
                    |     Data Source B   |
                    |   LegacyCustomerB   |
                    +----------+----------+
                               |
                               +------> Spring Boot API
```

## Data Migration

The project currently simulates two different legacy customer sources.

### Source A

Source A contains a flat structure:

```json
{
  "customerId": 1001,
  "fullName": "John Smith",
  "emailAddress": "john@example.com"
}
```

### Source B

Source B uses a different structure and contains nested contact information:

```json
{
  "clientCode": "C-1002",
  "firstName": "Jane",
  "surname": "Doe",
  "contact": {
    "email": "jane@example.com"
  }
}
```

Both structures are transformed into the common `Customer` model:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com"
}
```

The legacy models are used as input models. The normalized `Customer` model is the model persisted in MongoDB.

## Backend

The backend provides REST APIs for customer CRUD operations and data migration.

### Customer CRUD

```text
GET    /api/customers
GET    /api/customers/{id}
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers
```

### Customer Migration

Migration from Source A:

```text
POST /api/migrations/customers/source-a
```

Migration from Source B:

```text
POST /api/migrations/customers/source-b
```

## Project Structure

```text
Data-migration-hub/
|
├── Backend/
│   └── migration/
│       ├── src/
│       ├── pom.xml
│       └── ...
│
├── Frontend/
│   └── migration-frontend/
│       ├── src/
│       └── ...
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Running the Project

### 1. Start MongoDB

From the project root:

```bash
docker compose up -d
```

MongoDB will be available on:

```text
localhost:27017
```

### 2. Start the Backend

Navigate to:

```powershell
cd Backend/migration
```

Run:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will be available on:

```text
http://localhost:8080
```

### 3. Start the Frontend

Navigate to:

```powershell
cd Frontend/migration-frontend
```

Run:

```powershell
ng serve
```

The Angular application will be available on:

```text
http://localhost:4200
```

## Example Migration Flow

```text
Legacy Source A
      |
      | JSON
      v
LegacyCustomerA
      |
      | Transformation
      v
Customer
      |
      | Save
      v
MongoDB
```

The same process is available for `LegacyCustomerB`.

## Purpose

This project was created as a learning project to practice:

- Building REST APIs with Spring Boot
- Working with MongoDB using Spring Data
- Handling different data structures
- Transforming legacy data into a common model
- Building a frontend with Angular
- Using Docker for local infrastructure

# Data Migration Hub
 
A data migration platform built with Java 21, Spring Boot, MongoDB, Angular and Docker.
 
## Project Goal
 
The goal of this project is to simulate a data migration system where data from different legacy sources and structures is transformed into a common model and stored in MongoDB.
 
The application supports single-customer migration and bulk migration from JSON files, demonstrating how heterogeneous legacy customer data can be normalized into a common `Customer` model before being persisted.
 
## Technologies
 
- Java 21
- Spring Boot
- Spring Data MongoDB
- MongoDB
- Angular
- Docker
## Architecture
 
```text
+----------------------+       +----------------------+
|     Data Source A    |       |     Data Source B    |
|    LegacyCustomerA   |       |    LegacyCustomerB   |
+----------+-----------+       +-----------+----------+
           |                               |
           +---------------+---------------+
                           |
                           v
                +----------------------+
                |    Angular Frontend  |
                |    Data Migration    |
                |         Hub          |
                +----------+-----------+
                           |
                           | HTTP / JSON
                           v
                +----------------------+
                |    Spring Boot API   |
                |                      |
                |   Migration Service  |
                +----------+-----------+
                           |
                           | Transform data
                           v
                +----------------------+
                |   Customer Model     |
                |   Common Structure   |
                +----------+-----------+
                           |
                           | Save
                           v
                    +-------------+
                    |   MongoDB   |
                    +-------------+
```
 
## Data Migration
 
The application simulates two legacy customer sources with different data structures.
 
### Source A
 
Source A contains a flat structure with a full name and email address:
 
```json
{
  "customerId": 1001,
  "fullName": "John Smith",
  "emailAddress": "john.smith@example.com"
}
```
 
The migration service splits `fullName` into `firstName` and `lastName`, and maps `emailAddress` to `email`.
 
### Source B
 
Source B uses separate name fields and nested contact information:
 
```json
{
  "clientCode": "C-2001",
  "firstName": "Ana",
  "surname": "Silva",
  "contact": {
    "email": "ana.silva@example.com"
  }
}
```
 
The migration service maps `surname` to `lastName` and extracts the email from `contact.email`.
 
### Common Customer Model
 
Both legacy structures are transformed into the same `Customer` model before being persisted in MongoDB:
 
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com"
}
```
 
The legacy models are used as input models. The normalized `Customer` model is the model stored in MongoDB.
 
## Migration Modes
 
### Single-customer migration
 
Users can manually enter one legacy customer in the Angular interface and migrate it to the common customer model. This is available for both Source A and Source B.
 
### Bulk JSON import
 
Users can select a JSON file containing multiple legacy customers and import them in a single request.
 
The frontend:
 
- Reads the selected JSON file.
- Checks that it contains a non-empty JSON array.
- Validates the basic structure of each record against the selected source.
- Displays the number of customers ready for import.
- Sends the records to the corresponding bulk migration endpoint.
- Displays success or error notifications.
The backend transforms the records into the common `Customer` model and saves them using Spring Data MongoDB.
 
Sample JSON files are available in the `sample-migration-files/` directory.
 
> **Note:** Bulk imports currently create customer records and do not automatically update existing customers or prevent duplicates.
 
## Backend
 
The Spring Boot backend provides REST APIs for customer CRUD operations and data migration.
 
The bulk endpoints accept a JSON array in the request body and return the resulting list of customers.
 
## Frontend
 
The Angular application provides an interface to:
 
- View and manage customers.
- Create, update and delete customer records.
- Select a legacy data source.
- Choose between single-customer migration and bulk JSON import.
- Upload JSON files and review the number of records ready for import.
- Receive migration status notifications.
## Project Structure
 
```text
Data-Migration-Hub/
|
├── Backend/
│   └── migration/
│       ├── src/
│       ├── pom.xml
│       └── ...
|
├── Frontend/
│   └── migration-frontend/
│       ├── src/
│       ├── package.json
│       └── ...
|
├── sample-migration-files/
│   ├── source-a-customers.json
│   └── source-b-customers.json
|
├── docker-compose.yml
├── .gitignore
└── README.md
```
 
## Prerequisites
 
- Java 21
- Node.js and npm
- Angular CLI
- Docker with Docker Compose
## Running the Project
 
### 1. Start MongoDB
 
From the project root:
 
```bash
docker compose up -d
```
 
MongoDB should be available at:
 
```text
localhost:27017
```
 
### 2. Start the Backend
 
Navigate to the backend directory:
 
```bash
cd Backend/migration
```
 
Run the Spring Boot application using the Maven Wrapper:
 
```powershell
.\mvnw.cmd spring-boot:run
```
 
The backend should be available at:
 
```text
http://localhost:8080
```
 
### 3. Start the Frontend
 
Open another terminal and navigate to the Angular project:
 
```bash
cd Frontend/migration-frontend
```
 
Install the dependencies if necessary:
 
```bash
npm install
```
 
Start the Angular development server:
 
```bash
ng serve
```
 
The frontend should be available at:
 
```text
http://localhost:4200
```
 
## Testing the Bulk Import
 
1. Start MongoDB, the backend and the frontend.
2. Open the **Data Migration** page.
3. Select **Source A** or **Source B**.
4. Choose **Bulk import**.
5. Select the corresponding JSON file from `sample-migration-files/`.
6. Confirm that the expected number of customers is displayed.
7. Click **Import customers**.
8. Open the **Customers** page and verify the imported records.
Use the sample files provided in the repository to test both migration paths.
 
## Purpose
 
This project was created as a learning project to practise:
 
- Building REST APIs with Spring Boot.
- Performing CRUD operations.
- Working with MongoDB and Spring Data.
- Handling heterogeneous legacy data structures.
- Transforming legacy data into a common model.
- Implementing single and bulk data migration.
- Reading and validating JSON files in Angular.
- Integrating an Angular frontend with a Spring Boot backend.
- Using Docker for local infrastructure.

# Project-Management-System
Project Management System - Built using Node.js, Express.js and MySQL, it is backend only and uses RESTApi Architecture and MVC Design Pattern.


## Features -

* JWT-based authentication
* Cloud hosted Database
* User Registration and login
* CRUD on User, Projects and Tasks. 

## Database Schema and Relationship

- **User** to **Project**: Many-to-Many relationship.
- **Project** to **Task**: One-to-Many relationship.

- Used Sequelize as the ORM and MySQL for the database

- Used Clever Cloud - Database Cloud Hoisting Service (Ensuring 24*7 Uptime)


## Tech Stack Used - 

* Node.js
* Express.js
* MySQL
* Sequelize (ORM for MySQL)
* Jsonwebtoken (Authentication)
* Swagger (API Documentation)

#### Live Link : https://project-management-system-1-hk5n.onrender.com/api-docs/#/


### API Documentation : 

- Postman - 
https://app.getpostman.com/join-team?invite_code=43ed8bada615bfe3f7f86ae8d2b9343354a092cd7480eee8754dab7491dfa343

- Swagger -
 https://project-management-system-1-hk5n.onrender.com/api-docs


#### Codebase : https://github.com/pranavyamjal/Project-Management-System

## Steps to deploy locally

* Clone the Repository
git clone:-  https://github.com/pranavyamjal/Project-Management-System.git


*  Navigate to Project
```bash
cd Project-Management-System
```

* Install Dependencies
```bash
 npm install
```

* Set Up Environment Variables
```bash
cp .env.example .env
```

* To run 

```bash
npm start
```
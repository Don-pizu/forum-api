#  Forum API

## Description
The Forum API is a backend service designed to power discussion forums. It supports threaded/nested comments, user authentication, and topic management. This project provides a solid foundation for building community-driven platforms where users can engage in structured conversations.

## Features
-User authentication & authorization with JWT

-Create, update, delete forum posts

-Threaded/nested comment support for discussions

-Protected routes for authenticated users

-Role-based permissions for users and admins

-RESTful API design for scalability

-Environment configuration with .env


## Installation & Usage

``bash
# Clone the repository
git clone https://github.com/Don-pizu/forum-api.git

# Navigate into the project folder
cd forum-api

# Install dependencies
npm install

# Start the server
node server.js

project-root/
├── controllers/
├── models/
├── routes/ 
├── middleware/
├── config/
├── tests/
├── server.js
├── .env
├── .gitignore
└── README.md


## Technologies used
-Node.js
-Express.js
-MongoDB
-JWT Authentication
-Bcrypt.js (password hashing)
-dotenv (environment variables)
-Helmet, Express-rate-limit, Mongo-sanitize, XSS-clean


## Author name

-Asiru Adedolapo

## Stage, Commit, and Push**

``bash
git add .
git commit -m "feat: initial project setup with folder structure and README"
git branch -M main
git remote add origin https://github.com/Don-pizu/forum-api.git
git push -u origin main


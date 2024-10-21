# Game API

## Description
The Game API is a RESTful service designed to manage user accounts, authentication, and a leaderboard for a gaming application. It allows users to register, log in, update their scores, and retrieve leaderboard information.

## Features
- User registration with password hashing.
- User authentication with JWT tokens.
- Secure handling of user passwords.
- Leaderboard functionality to display the top players.
- Profile management for users.

## Technology Stack
- **Backend Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JSON Web Tokens (JWT)
- **Environment Management**: dotenv
- **Middleware**: cors, body-parser

## API Endpoints

### User Endpoints

- **POST** `/api/user/register`
  - Registers a new user.
  - **Request Body**: 
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**: 
    - `201 Created` with user ID and username on success.
    - `500 Internal Server Error` on failure.

- **POST** `/api/user/:clientRequestId/login`
  - Logs in a user and returns a JWT token.
  - **Request Body**: 
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**: 
    - `200 OK` with token on success.
    - `401 Unauthorized` on invalid credentials.
    - `500 Internal Server Error` on failure.

- **GET** `/api/user/:token/profile`
  - Retrieves the user profile based on the provided token.
  - **Response**: 
    - `200 OK` with user profile information on success.
    - `404 Not Found` if the user does not exist.
    - `500 Internal Server Error` on failure.

- **PATCH** `/api/user/:token/highscore`
  - Updates the user’s high score.
  - **Request Body**: 
    ```json
    {
      "highScore": "number"
    }
    ```
  - **Response**: 
    - `200 OK` with success message on success.
    - `404 Not Found` if the user does not exist.
    - `500 Internal Server Error` on failure.

### Leaderboard Endpoints

- **GET** `/api/leaderboard`
  - Retrieves the top 10 users based on high scores.
  - **Response**: 
    - `200 OK` with leaderboard data on success.
    - `500 Internal Server Error` on failure.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/game-api.git
   cd game-api

2. Install Dependencies:
  
  npm install

3. Create a .env file in the root directory and add your database URL:

  DATABASE_URL=your_postgres_database_url
JWT_SECRET=your_jwt_secret

4. Start Server

  npm start

5. Usage

You can use tools like Postman or curl to interact with the API endpoints. Make sure to include the necessary headers for authentication when required.

6. Contributing

Contributions are welcome! Please open an issue or submit a pull request.

7. License MIT

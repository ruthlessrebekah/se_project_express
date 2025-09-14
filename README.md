# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

## Features Implemented (Sprint 12)

### Schemas & Models

- User schema: `name` (2-30 chars, required), `avatar` (required, URL validated)
- ClothingItem schema: `name` (2-30 chars, required), `weather` (enum: 'hot', 'warm', 'cold'), `imageUrl` (required, URL validated), `owner` (ObjectId ref to User), `likes` (array of ObjectId refs to User), `createdAt` (default: Date.now)

### Routes & Controllers

- Users:
  - `GET /users` — returns all users
  - `GET /users/:userId` — returns user by \_id
  - `POST /users` — creates a new user
- Clothing Items:
  - `GET /items` — returns all clothing items
  - `POST /items` — creates a new item
  - `DELETE /items/:itemId` — deletes an item by \_id
  - `PUT /items/:itemId/likes` — like an item
  - `DELETE /items/:itemId/likes` — unlike an item

### Middleware

- Temporary authorization: adds a hardcoded user ID to each request (`req.user._id`)
- 404 handler for non-existent resources: returns `{ message: "Requested resource not found" }`

### Error Handling

- Centralized error codes in `utils/errors.js` (`BAD_REQUEST`, `NOT_FOUND`, `SERVER_ERROR`)
- Controllers use these codes and return JSON error messages
- Validation errors, not found errors, and server errors handled for all major routes

### Other

- All routes and controllers tested for expected status codes and response formats
- All endpoints return JSON objects with relevant data or error messages

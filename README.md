# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

## Features Implemented (Sprint 12 and Beyond)

### Schemas & Models

- User schema: `name` (2-30 chars, required), `avatar` (required, URL validated), `email` (unique, validated), `password` (hashed, hidden from queries)
- ClothingItem schema: `name` (2-30 chars, required), `weather` (enum: 'hot', 'warm', 'cold'), `imageUrl` (required, URL validated), `owner` (ObjectId ref to User), `likes` (array of ObjectId refs to User), `createdAt` (default: Date.now)

### Authentication & Authorization

- JWT-based authentication for protected routes
- Passwords hashed with bcrypt
- Only item owners can delete their own clothing items (403 error for unauthorized deletes)
- User profile management: `GET /users/me`, `PATCH /users/me`

### Routes & Controllers

- Users:
  - `POST /signup` — create user (validates required fields, hides password in response)
  - `POST /signin` — login (validates required fields, returns JWT)
  - `GET /users/me` — get current user
  - `PATCH /users/me` — update current user
- Clothing Items:
  - `GET /items` — get all items
  - `POST /items` — create item (owner set to current user)
  - `DELETE /items/:itemId` — delete item (only owner can delete)
  - `PUT /items/:itemId/likes` — like item
  - `DELETE /items/:itemId/likes` — unlike item

### Middleware & Error Handling

- Centralized error codes in `utils/errors.js` (`BAD_REQUEST`, `NOT_FOUND`, `FORBIDDEN`, `SERVER_ERROR`)
- Controllers return JSON error messages with correct status codes
- CORS enabled for cross-origin requests
- All validation and authorization errors return appropriate status codes (400, 401, 403, 404, 500)

### Other

- All routes and controllers tested for expected status codes and response formats
- All endpoints return JSON objects with relevant data or error messages
- Postman tests for validation, authorization, and error handling

## Domain Names

**Frontend:** https://se-project-react-1pv7.onrender.com
**Backend:** https://se-project-express-g21v.onrender.com

## Project Pitch Video

Check out [my WTWR Project Pitch Video](https://www.loom.com/share/dc79bf894154495192fe12d41f1661ac), where I describe my project and some challenges I faced while building it.

## Deployment on Render

This project is configured for deployment on [Render](https://render.com/). The following changes and notes apply:

- **trust proxy** is enabled in the Express app to ensure correct client IP handling and rate limiter compatibility when running behind Render's proxy infrastructure.
- Make sure to set any required environment variables in the Render dashboard (e.g., JWT_SECRET, DB connection string, etc.).
- The `Procfile` and `render.yaml` files are included for Render deployment configuration.

### How to Deploy

1. Push your code to the connected GitHub repository.
2. Render will automatically build and deploy the app based on the configuration files.
3. Ensure your environment variables are set in the Render dashboard.
4. The backend will be available at the Render-provided URL (see above for domain).

**Note:** If you are running the app locally, you do not need to enable `trust proxy`.

# Task Management Application

A full-stack task management app built with React, Vite, PrimeReact, Node.js, Express and MongoDB.

## Features
- Create, view, edit and delete tasks
- Task fields: title, description, status, priority, due date and assignee
- Statuses: To Do, In Progress, Completed
- Search, status/priority filters and sorting
- Dashboard counts by status and overdue count
- Team member list and task assignment
- MongoDB persistence
- REST APIs with validation and centralized error handling
- Server-side pagination

## Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string
- npm

## Run locally

### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```
The API runs at `http://localhost:5000`.

### 2. Frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

Set `VITE_API_URL` in `frontend/.env` only if the API is not running at `http://localhost:5000/api`.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Paginated tasks; supports `page`, `limit`, `search`, `status`, `priority`, `assignee`, `sortBy`, `order` |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Task details |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/dashboard` | Dashboard counts |
| GET | `/api/users` | Team members |
| POST | `/api/users` | Create team member |

Example:
`GET /api/tasks?page=1&limit=10&search=design&status=In%20Progress&sortBy=dueDate&order=asc`

## Database
MongoDB database: `task_management`

Collections:
- `tasks`: title, description, status, priority, dueDate, assignee (User ObjectId), timestamps
- `users`: name, email, role, timestamps

Run `npm run seed` in the backend folder to insert sample team members and tasks. The seed script is safe to re-run: it creates sample users only when the user collection is empty, and creates sample tasks only when the task collection is empty.

## Validation and error handling
- Required title, valid status/priority, valid due date and valid assignee ObjectId
- Assignee must exist
- Mongoose validation errors and invalid IDs return HTTP 400
- Missing records return HTTP 404
- Unexpected errors return HTTP 500 with a consistent JSON shape

## Notes
This assignment intentionally omits authentication to keep the scope aligned with the 6–8 hour brief. For production, add authentication/authorization, rate limiting, audit logs and automated tests.

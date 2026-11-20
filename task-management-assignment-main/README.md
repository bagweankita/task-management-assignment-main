
# Task Management Application

A full-stack Task Management Application developed using React.js, Node.js, Express.js, and MongoDB.

The application allows users to manage tasks, assign team members, track task progress, and monitor overall task statistics through a dashboard.

## Live Demo

Frontend: https://task-management-assignment-gamma.vercel.app

GitHub Repository: https://github.com/bagweankita/task-management-assignment

## Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios (if used)

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- MongoDB Atlas

### Deployment
- Frontend: Vercel
- Backend: Render

## Features

- Create new tasks
- View all tasks
- Update and delete tasks
- Manage task status:
  - To Do
  - In Progress
  - Completed
- Manage task priorities
- Assign tasks to team members
- Search tasks
- Filter tasks by status and priority
- Sort tasks
- Dashboard with task statistics
- Overdue task tracking
- Server-side pagination
- Form validation and error handling
- MongoDB database integration

## Project Structure

The project contains frontend and backend application code.

- Frontend: React.js application
- Backend: Node.js and Express.js REST API
- Database: MongoDB

## Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/bagweankita/task-management-assignment.git
```

```bash
cd task-management-assignment
```

### 2. Install Dependencies

Navigate to the frontend and backend directories and install dependencies using:

```bash
npm install
```

Run this command separately inside each application directory.

### 3. Environment Configuration

Create a `.env` file in the backend directory.

Configure the MongoDB connection string and required environment variables.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

If the frontend uses an API base URL environment variable, configure it with your backend URL as required by the application.

**Note:** Replace the example values with your actual configuration. Do not commit environment files or database credentials.

### 4. Run the Application

Start the backend server:

```bash
npm start
```

Start the frontend application in a separate terminal:

```bash
npm start
```

Use the actual scripts defined in each application's package.json. For example, some projects use `npm run dev`.

## API Integration

The backend exposes REST APIs to manage tasks and team members.

The APIs support:

- Creating tasks
- Fetching tasks
- Updating tasks
- Deleting tasks
- Searching and filtering tasks
- Sorting and pagination
- Managing team member assignments

## Database

MongoDB is used to persist application data.

The database stores task information, including:

- Title
- Description
- Status
- Priority
- Due Date
- Assignee

## Deployment

- Frontend deployed on Vercel.
- Backend deployed on Render.
- Database hosted on MongoDB Atlas.

## Author

Ankita Bagwe

React.js | Node.js | Express.js | MongoDB

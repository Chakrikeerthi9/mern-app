## To-Do MERN App

A simple full-stack **To-Do List** application built with the **MERN** stack:

- **MongoDB Atlas** – stores tasks
- **Express.js** – REST API backend
- **React.js** – frontend UI
- **Node.js** – runtime for the backend

The app supports full **CRUD** for tasks:

- **Create** – add new tasks
- **Read** – list all tasks
- **Update** – edit/mark complete
- **Delete** – remove tasks

This repo is structured as:

- `backend` – Express API with MongoDB (Mongoose) and Jest + Supertest tests
- `frontend` – React app consuming the API with Jest + React Testing Library tests

---

## 1. Project Structure

```text
todo-mern-app/
  backend/
    server.js
    package.json
    .env          # NOT committed – create manually
    tests/
      api.test.js
    src/
      models/
        Task.js
      routes/
        tasks.js
  frontend/
    public/
      index.html
    src/
      App.js
      App.css
      App.test.js
      index.js
      api.js
      components/
        TaskForm.js
        TaskList.js
    package.json
    .env          # NOT committed – create manually
```

---

## 2. Backend – Express + MongoDB

### 2.1. Environment variables

Create `backend/.env` with:

```bash
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=development
```

For MongoDB Atlas:

- Create a free cluster
- Create a database user and password
- Allow IP access (0.0.0.0/0 for testing, or specific IPs)
- Get the connection string from the **Connect** button (choose "Drivers" → Node.js)
- Replace `<password>` and `myFirstDatabase` with your actual password and database name (e.g. `todo_db`)

### 2.2. Install backend dependencies

From the `backend` folder:

```bash
cd /Users/chakrikeerthi/Downloads/MERN/todo-mern-app/backend
npm install
```

This installs:

- `express`, `mongoose`, `cors`, `dotenv`
- Dev: `jest`, `supertest`, `mongodb-memory-server`, `cross-env`

### 2.3. Run backend locally

```bash
cd /Users/chakrikeerthi/Downloads/MERN/todo-mern-app/backend
npm run dev
```

The API will run on `http://localhost:5000`.

Available endpoints:

- `GET /api/health` – health check
- `GET /api/tasks` – list all tasks
- `GET /api/tasks/:id` – get single task
- `POST /api/tasks` – create task
- `PUT /api/tasks/:id` – update task
- `DELETE /api/tasks/:id` – delete task

### 2.4. Backend tests

Run:

```bash
cd /Users/chakrikeerthi/Downloads/MERN/todo-mern-app/backend
npm test
```

This uses Jest + Supertest to run **at least 2 tests** for the API:

- POST `/api/tasks` creates a task
- DELETE `/api/tasks/:id` deletes a task

Additional tests cover reading/updating tasks.

---

## 3. Frontend – React

### 3.1. Environment variables

Create `frontend/.env` with:

```bash
REACT_APP_API_BASE_URL=http://localhost:5000
```

In production, set this to your deployed backend URL, e.g.:

```bash
REACT_APP_API_BASE_URL=https://your-backend.onrender.com
```

### 3.2. Install frontend dependencies

From the `frontend` folder:

```bash
cd /Users/chakrikeerthi/Downloads/MERN/todo-mern-app/frontend
npm install
```

This installs:

- `react`, `react-dom`
- `react-scripts`
- Dev: `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`

### 3.3. Run frontend locally

```bash
cd /Users/chakrikeerthi/Downloads/MERN/todo-mern-app/frontend
npm start
```

The app will run on `http://localhost:3000` and call the backend via `REACT_APP_API_BASE_URL`.

### 3.4. Frontend tests

Run:

```bash
cd /Users/chakrikeerthi/Downloads/MERN/todo-mern-app/frontend
npm test
```

Included tests (at least 2):

- Adding a task via the form causes it to appear in the list
- Marking a task as complete updates its status in the UI

---

## 4. Deployment

### Quick Deployment Guide

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed step-by-step instructions.

### Summary

1. **MongoDB Atlas**: Set up free cluster, get connection string
2. **Backend (Render)**:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Env vars: `MONGODB_URI`, `NODE_ENV=production`
3. **Frontend (Vercel)**:
   - Root Directory: `frontend`
   - Build: `npm run build` (default)
   - Env var: `REACT_APP_API_BASE_URL=https://your-backend.onrender.com`

### Important Notes

- **MongoDB Atlas**: Free tier works perfectly for this app
- **Render**: Free tier may spin down after inactivity (first request may be slow)
- **Vercel**: Free tier is excellent for React apps, no spin-down
- **CORS**: Backend is configured to allow Vercel domains automatically

---

## 5. Notes

- Do **not** commit `.env` files – they contain secrets.
- For local development, ensure both backend (`5000`) and frontend (`3000`) are running.
- The task model and routes are simple and can be extended with due dates, priorities, and user auth if needed.



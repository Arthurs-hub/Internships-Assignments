# Primetrade Task Manager API

A scalable REST API with JWT authentication, role-based access control, and a React frontend.

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL, JWT, bcrypt, Swagger
- **Frontend**: React 18, Vite, Axios, React Router

## Features

- User registration & login with bcrypt password hashing
- JWT-based authentication (7-day expiry)
- Role-based access: `user` (own tasks only) vs `admin` (all tasks + user list)
- Full CRUD for Tasks entity
- Input validation & sanitization via `express-validator`
- API versioning (`/api/v1/`)
- Swagger UI documentation at `/api-docs`
- Global error handling & proper HTTP status codes

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
npm run dev
```

The server starts at `http://localhost:5000`.  
Tables are auto-created on first run.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Register user |
| POST | `/api/v1/auth/login` | ❌ | Login, get JWT |
| GET | `/api/v1/auth/me` | ✅ | Current user profile |
| GET | `/api/v1/tasks` | ✅ | Get tasks (own / all for admin) |
| GET | `/api/v1/tasks/:id` | ✅ | Get single task |
| POST | `/api/v1/tasks` | ✅ | Create task |
| PUT | `/api/v1/tasks/:id` | ✅ | Update task |
| DELETE | `/api/v1/tasks/:id` | ✅ | Delete task |
| GET | `/api/v1/tasks/admin/all` | ✅ Admin | List all users |

Full interactive docs: `http://localhost:5000/api-docs`

## Database Schema

```sql
users (id, name, email, password, role, created_at)
tasks (id, title, description, status, user_id → users.id, created_at)
```

## Security Practices

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT signed with secret, verified on every protected route
- Input sanitized and validated before DB queries
- Parameterized queries (no SQL injection)
- Role check middleware prevents privilege escalation
- CORS enabled for frontend origin

## Scalability Notes

The project is structured for easy horizontal scaling:

- **Stateless JWT** — any instance can verify tokens; no session storage needed
- **Modular routes** — add new entities (e.g., `/api/v1/products`) without touching existing code
- **API versioning** — `/api/v1/` allows breaking changes via `/api/v2/` without downtime
- **Connection pooling** — `pg.Pool` reuses DB connections efficiently
- **Caching (optional)** — Redis can cache `/tasks` responses; invalidate on write
- **Docker** — containerize backend + frontend + postgres with `docker-compose` for consistent deploys
- **Load balancing** — stateless design works behind Nginx or AWS ALB with multiple Node instances
- **Microservices path** — auth service and tasks service can be split independently when load demands it

# Finance Backend API

A RESTful backend for a finance dashboard system built with **Laravel 12**, **Sanctum**, and **SQLite**.

## Stack

- **PHP 8.2** + **Laravel 12**
- **Laravel Sanctum** — token-based authentication
- **SQLite** — zero-config database
- **Eloquent ORM** — data modeling
- **Form Requests** — input validation
- **API Resources** — response transformation
- **Soft Deletes** — non-destructive record removal

---

## Setup

```bash
git clone https://github.com/Arthurs-hub/Internships-Assignments.git
cd Internships-Assignments/Zorvyn_assignment

composer install

cp .env.example .env
php artisan key:generate

php artisan migrate:fresh --seed

php artisan serve
```

API is available at `http://localhost:8000/api`

---

## Roles

| Role     | Permissions                                      |
|----------|--------------------------------------------------|
| viewer   | Read financial records                           |
| analyst  | Read records + access dashboard analytics        |
| admin    | Full access: manage records and users            |

---

## Test Accounts

| Email                  | Password | Role     |
|------------------------|----------|----------|
| admin@example.com      | password | admin    |
| analyst@example.com    | password | analyst  |
| viewer@example.com     | password | viewer   |

---

## API Endpoints

### Auth

| Method | Endpoint        | Auth | Description          |
|--------|-----------------|------|----------------------|
| POST   | /api/register   | —    | Register new user    |
| POST   | /api/login      | —    | Login, returns token |
| POST   | /api/logout     | ✓    | Revoke current token |
| GET    | /api/me         | ✓    | Current user info    |

### Financial Records

| Method | Endpoint                  | Role            | Description               |
|--------|---------------------------|-----------------|---------------------------|
| GET    | /api/records              | viewer+         | List with filters         |
| GET    | /api/records/{id}         | viewer+         | Single record             |
| POST   | /api/records              | admin           | Create record             |
| PUT    | /api/records/{id}         | admin           | Update record             |
| DELETE | /api/records/{id}         | admin           | Soft delete               |

**Filters:** `?type=income&category=Salary&date_from=2025-01-01&date_to=2025-12-31&per_page=10`

### Dashboard

| Method | Endpoint                        | Role      | Description                     |
|--------|---------------------------------|-----------|---------------------------------|
| GET    | /api/dashboard/summary          | analyst+  | Total income, expenses, balance |
| GET    | /api/dashboard/by-category      | analyst+  | Totals by category              |
| GET    | /api/dashboard/monthly-trends   | analyst+  | Monthly trends                  |
| GET    | /api/dashboard/recent-activity  | analyst+  | Last 10 transactions            |

### User Management (admin only)

| Method | Endpoint          | Description                      |
|--------|-------------------|----------------------------------|
| GET    | /api/users        | List all users                   |
| GET    | /api/users/{id}   | Get user                         |
| PUT    | /api/users/{id}   | Update role, status              |
| DELETE | /api/users/{id}   | Deactivate user                  |

---

## Access Control

Role enforcement via `RequireRole` middleware:

- `viewer` — read records only
- `analyst` — read records + dashboard
- `admin` — full access
- Inactive users are blocked regardless of role

---

## Data Model

### users
| Column     | Type    | Notes                    |
|------------|---------|--------------------------|
| id         | integer | Primary key              |
| name       | string  |                          |
| email      | string  | Unique                   |
| password   | string  | Hashed                   |
| role       | enum    | viewer / analyst / admin |
| is_active  | boolean | Default true             |

### financial_records
| Column     | Type      | Notes              |
|------------|-----------|--------------------|
| id         | integer   | Primary key        |
| user_id    | integer   | FK → users         |
| amount     | decimal   | 15,2               |
| type       | enum      | income / expense   |
| category   | string    |                    |
| date       | date      |                    |
| notes      | text      | Nullable           |
| deleted_at | timestamp | Soft delete        |

---

## Assumptions

- Token-based auth via Sanctum (suitable for API clients)
- User deletion = deactivation (data preserved)
- Record deletion = soft delete (restorable)
- SQLite used for zero-config local setup
- Database seeded with 3 users and 30 financial records

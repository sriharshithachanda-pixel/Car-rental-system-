# Car Rental System (MERN)

Register / Login / Logout are implemented, but there is **no real authentication or
authorization** (no JWT, sessions, protected routes or roles). After login the user
object is kept in `localStorage`. Suitable for learning and demos only.

## Features
- Register, login, logout (password hashed with bcrypt)
- Browse cars with search and filters (name/brand, transmission, fuel, seats, max price)
- Add, edit and delete cars (with image URL)
- Book a car for a date range (overlap check, past-date check, auto price calculation)
- My Bookings page with status (confirmed / cancelled) and cancel option

## Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

## Setup

### 1. Backend
```bash
cd server
npm install
# edit .env if your MongoDB URI is different
npm run dev
```
Runs on http://localhost:5000

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
Runs on http://localhost:5173

(Optional) copy `client/.env.example` to `client/.env` to change the API URL.

## API summary
| Method | Endpoint                    | Purpose                        |
|--------|-----------------------------|--------------------------------|
| POST   | /api/auth/register          | Create account                 |
| POST   | /api/auth/login             | Login, returns user object     |
| GET    | /api/cars                   | List cars (supports filters)   |
| GET    | /api/cars/:id               | Get one car                    |
| POST   | /api/cars                   | Add car                        |
| PUT    | /api/cars/:id               | Edit car                       |
| DELETE | /api/cars/:id               | Delete car (if no upcoming bookings) |
| POST   | /api/bookings               | Create booking                 |
| GET    | /api/bookings/user/:userId  | User's bookings                |
| PUT    | /api/bookings/:id/cancel    | Cancel booking                 |

## Known limitations (by design)
- Any API endpoint can be called without logging in.
- `userId` is trusted from the request body.
- Any logged-in user can edit or delete any car.

To harden later: add JWT middleware, roles (admin/customer), and input validation.

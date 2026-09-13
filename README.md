# Spendly Expense Tracker

MERN expense tracker with JWT authentication, protected routes, CRUD expenses, reports, and responsive React UI.

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and `JWT_SECRET`.
2. In `backend`, run `npm install` then `npm run dev`.
3. In `frontend`, run `npm install` then `npm run dev`.

The frontend uses `http://localhost:5000/api` for the API locally. For a deployed frontend, set the Vercel environment variable `VITE_API_URL` to the public backend URL, including `/api`, for example `https://your-backend.example.com/api`, then redeploy the frontend.

Deploy the `backend` directory as a separate Node.js service using `npm install` and `npm start`. Add `MONGO_URI`, `JWT_SECRET`, and `PORT` (if required by the hosting provider) to that service's environment variables. The backend must be publicly reachable over HTTPS so the Vercel frontend can call it.

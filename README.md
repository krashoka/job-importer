# Job Importer – Full Stack Assignment (MERN)

This project is a scalable **job import system** that periodically fetches job postings from external XML feeds, processes them asynchronously using a queue, stores them in MongoDB, and exposes an admin UI to track import history.

The solution is designed to handle **large datasets (1M+ records)** efficiently and aligns with the requirements provided in the assignment document.

---

## Features

### Backend
- Fetches job data from multiple external **XML feeds**
- Normalizes different feed formats into a **single canonical job schema**
- Uses **BullMQ + Redis** for asynchronous job processing
- Prevents duplicate jobs using **MongoDB upserts**
- Tracks detailed **import history** (total, new, updated, failed)
- Runs automatically via **cron (hourly)**
- Retry + exponential backoff for failed jobs

### Frontend
- Built with **Next.js (App Router)**
- Admin screen to view **import history**
- Clean, table-based UI matching the assignment sample
- Supports **pagination**
- Fetches real-time data from backend APIs

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Redis
- BullMQ
- node-cron
- Docker (for Redis)

### Frontend
- Next.js (React, App Router)
- TypeScript
- Fetch API (no extra client libraries)

---

## Project Structure

job-importer/
├── client/ # Frontend (Next.js)
│ └── app/
│ └── import-logs/ # Import history UI
├── server/ # Backend (Node.js)
│ └── src/
│ ├── cron/ # Scheduled imports
│ ├── jobs/ # Queue & worker
│ ├── models/ # MongoDB schemas
│ ├── normalizers/ # Feed-specific mappers
│ ├── routes/ # API routes
│ ├── services/ # Feed fetching logic
│ └── utils/ # XML parsing helpers
└── docs/
└── architecture.md


---

## Setup Instructions

### 1️. Clone Repository
```bash
git clone <repo-url>
cd job-importer
```
### 2️. Backend Setup
cd server
npm install

Create .env file:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job_importer
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

### 3️. Start Redis (Docker)
run below command: 
docker run -d --name redis-job-importer -p 6379:6379 redis

### 4. Start Backend Services
Terminal 1 – API + Cron
npm run dev

Terminal 2 – Worker
npm run worker

### 5️. Frontend Setup
cd ../client
npm install
npm run dev

Open:
http://localhost:3000

## Backend APIs
Get Import History (Paginated)
GET /api/import-logs?page=1&limit=10

Response:
{
  "data": [...],
  "pagination": {
    "totalRecords": 50,
    "currentPage": 1,
    "totalPages": 5,
    "pageSize": 10
  }
}

## Import Workflow (High Level):
1. Cron runs every hour
2. External XML feeds are fetched
3. Jobs are normalized into a common format
4. Jobs are pushed to Redis queue
5. Worker processes jobs asynchronously
6. Jobs are inserted/updated in MongoDB
7. Import history is updated

## Error Handling & Reliability:
1. Exponential retry on job failure
2. Failed jobs logged with error reason
3. Defensive validation for job identifiers
4. Idempotent upserts to avoid duplication

## Notes:
1. Redis runs via Docker for consistency across environments
2. Worker runs as a separate process for scalability
3. Architecture is extensible for additional feeds


### **Author**
Ashok Kumar
Full Stack Developer ( React / Next.js / Angular / Node.js)
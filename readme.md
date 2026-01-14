# 🚀 ServiceHive(Assignment)


---

## Backend Deployed on render : https://gigflow-ts2n.onrender.com




## 📦 Project Local Setup Guide

###  Clone the Repository

```bash
git clone https://github.com/itsnikhil24/GigFlow.git
```

### 🔧 Backend Setup
### 1. Open Terminal & Navigate to Backend
```bash
cd backend
```
### 2. Install Backend Dependencies
```bash
npm install
```
### 3. Create .env File
```bash


MONGO_URI=<Your-string>

JWT_SECRET=<your-secret

PORT=3000

CLIENT_URL=Frontend-url


```
### 4. Start Backend Server
```bash
node index.js
```

### Backend will start running on: http://localhost:3000

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/api/auth/register` | Register a new user                |
| POST   | `/api/auth/login`    | Login user and set HttpOnly cookie |
| POST   | `/api/auth/logout`   | Logout user and clear auth cookie  |
| GET    | `/api/auth/me`       | Get currently logged-in user       |

| Method | Endpoint          | Description                            |
| ------ | ----------------- | -------------------------------------- |
| GET    | `/api/gigs`       | Get all available gigs                 |
| POST   | `/api/gigs`       | Create a new gig (Authenticated)       |
| GET    | `/api/gigs/mygig` | Get gigs created by the logged-in user |
| GET    | `/api/gigs/:id`   | Get gig details by gig ID              |
| DELETE | `/api/gigs/:id`   | Delete a gig (Owner only)              |


| Method | Endpoint                | Description                                      |
| ------ | ----------------------- | ------------------------------------------------ |
| POST   | `/api/bids`             | Place a bid on a gig (Authenticated)             |
| GET    | `/api/bids/:gigId`      | Get all bids for a specific gig (Gig owner only) |
| PATCH  | `/api/bids/:bidId/hire` | Hire a freelancer for a bid                      |
| GET    | `/api/bids/mybid`       | Get bids placed by the logged-in user            |



## Frontend Setup
 ### 1. Open a New Terminal


### 2. Navigate to the frontend directory:

```bash
cd frontend
```
### 3. Install Frontend Dependencies
```bash
npm install
```
### 4. Add environment variable for frontend

```bash
VITE_API_URL = <your-url>
```

### Start Frontend
```bash
npm run dev
```

### Frontend will run on: http://localhost:5173






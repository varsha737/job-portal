# 💼 Job Portal (MERN Stack)

A full-stack **Job Portal** web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows job seekers to find and apply for jobs, and recruiters to post and manage job listings.

---

## ✨ Features

### 👨‍💼 For Job Seekers
- User registration & login
- Browse available job listings
- Apply to jobs
- Create and update profile
- View applied jobs

### 🧑‍💼 For Recruiters
- Recruiter registration & login
- Post, edit, and delete job listings
- View applicants for a job
- Recruiter dashboard with stats

### 🛡️ Common
- Role-based access (User / Recruiter)
- JWT Authentication
- Responsive UI (mobile-friendly)
- Secure API endpoints

---

## 🛠 Tech Stack

### Frontend
- React.js (with React Router)
- Axios for API calls
- CSS (or Tailwind/SCSS as preferred)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT) for auth
- bcrypt.js for password hashing

## 🔌 API Endpoints Overview

### Auth Routes
| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| POST   | `/api/auth/register` | Register a new user    |
| POST   | `/api/auth/login`    | Login and get token     |

### User Routes
| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| GET    | `/api/users/profile` | Get current user profile   |
| PUT    | `/api/users/profile` | Update user info           |

### Job Routes
| Method | Endpoint             | Description                  |
|--------|----------------------|------------------------------|
| GET    | `/api/jobs`          | Get all jobs                 |
| GET    | `/api/jobs/:id`      | Get job by ID                |
| POST   | `/api/jobs`          | Create a new job (Recruiter) |
| PUT    | `/api/jobs/:id`      | Update job (Recruiter)       |
| DELETE | `/api/jobs/:id`      | Delete job (Recruiter)       |

### Application Routes (Planned)
| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| POST   | `/api/applications`        | Apply for a job (User)         |
| GET    | `/api/applications/:jobId` | View applicants (Recruiter)    |

---

## 🛠️ Tech Stack

| Layer     | Technologies                        |
|-----------|-------------------------------------|
| Frontend  | React.js, Axios, React Router       |
| Backend   | Node.js, Express.js, MongoDB, JWT   |
| Styling   | CSS (or Tailwind optional)          |
| Hosting   | Vercel (frontend), Render (backend) |

---

## 🚀 Getting Started


## 📁 Folder Structure

jobportal/
├── client/ # React frontend
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ └── App.js
├── config/ # Express backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ └── index.js
├── .env
├── package.json
└── README.md

```bash
git clone https://github.com/yourusername/jobportal.git
cd jobportal

Setup Environment Variables
Create .env file in server/:
env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Install Dependencies
npm i concurrently

Run the App
npm run dev


🧩 To-Do / Future Enhancements
Resume Builder (planned)

AI-powered job recommendations (planned)

Email/WhatsApp alerts (optional)

Recruiter analytics dashboard


🤝 Contributing
Contributions are welcome! Please open an issue to discuss any changes or features before submitting a PR.


Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)


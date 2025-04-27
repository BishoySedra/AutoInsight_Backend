# AutoInsight Backend

AutoInsight is a backend for a full-stack data analysis platform.  
It allows users to upload CSV files, clean their data, generate insights, and manage team collaboration.  
It also supports chatbot communication, reviews, notifications, and login with multiple OAuth providers.

---

## 📁 Project Structure

```bash
.
├── index.js                  # Entry point
├── .env                       # Environment variables
├── docker-compose.yml         # Local MongoDB setup
├── package.json               # Node.js dependencies and scripts
└── src/
    ├── adapters/              # Email adapter (Nodemailer)
    ├── config/                # App configs + Passport.js strategies
    ├── controllers/           # Request handlers (Auth, Dataset, Review, etc.)
    ├── DB/
    │   ├── config.js          # MongoDB connection
    │   └── models/            # Mongoose models (User, Dataset, Review, Notification, etc.)
    ├── middlewares/           # Authorization, validation, error handling
    ├── repositories/          # Token handling (e.g., for password reset)
    ├── routes/                # API Routes
    ├── services/              # Business logic (Dataset analysis, OAuth signup, etc.)
    └── utils/                 # Helper utilities (JWT, password hashing, Chatbot, etc.)
```

---

## 🚀 Main Features

- **Authentication**: 
  - Email/password signup and login
  - Password reset via email
  - OAuth login with **Google**, **GitHub**, and **Facebook** (Strategy Pattern for easy extension)
- **Dataset Handling**: 
  - Upload CSV files
  - Clean datasets
  - Generate automated insights and charts
  - Share datasets with permission control
- **AI Chatbot**: 
  - Powered by **Google Gemini** API
  - Supports text and image inputs
- **Team Collaboration**: 
  - Create teams
  - Assign datasets
  - Manage team members
- **Review & Feedback System**: 
  - Collect user reviews
  - Analyze sentiment (Positive, Neutral, Negative)
- **Notifications**: 
  - In-app notifications for activities (dataset shared, dataset deleted, etc.)

---

## ⚙️ Tech Stack

| Layer         | Technology |
|---------------|------------|
| Backend       | Express.js |
| Database      | MongoDB + Mongoose |
| Authentication| Passport.js + JWT |
| AI Chatbot    | Google Gemini API |
| ML Analysis   | FastAPI (Python Server) |
| Cloud Storage | Cloudinary |
| Email Service | Nodemailer |
| OAuth         | Google, GitHub, Facebook |

---

## 🛠️ Setup and Installation

1. **Clone the repository**

```bash
git clone https://github.com/BishoySedra/AutoInsight_Backend.git
cd AutoInsight_Backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file** and fill it with your own credentials:

```env
PORT=5000
BASE_URL=/api/v1

# MongoDB
MONGO_DB=AutoInsight
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password
MONGO_HOST=cluster0.mongodb.net

# Authentication
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/v1/auth/github/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/v1/auth/facebook/callback

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_SECRET_KEY=your_cloud_secret_key

# FastAPI ML Server URL
FASTAPI_URL=http://localhost:8000

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

4. **Start MongoDB using Docker (Optional)**

```bash
npm run dev:db
```

5. **Run the server**

```bash
npm run dev
```

🔗 Your backend will be live at:

```
http://localhost:5000/api/v1/
```

---

## 🔒 OAuth Providers

You can now authenticate using:

- [x] Google (via Passport + Strategy)
- [x] GitHub (via Passport + Strategy)
- [x] Facebook (via Passport + Strategy and Graph API)

The backend uses a **Strategy Pattern** to easily add new OAuth providers with clean, reusable code.

---

## 🧪 Testing the API

📬 **Postman Collection**:  
👉 [Click here to open the Postman docs](https://documenter.getpostman.com/view/32763635/2sAYQiCo4i)

(You can import the collection and easily test login, signup, datasets, chatbot, teams, reviews, and more!)

---

## 📜 Notes

- Facebook login may **not always return email**. If not available, we fetch manually using Facebook Graph API.
- If your local FastAPI server is not running, some endpoints (dataset analysis, cleaning, chatbot) will not work.
- Cloudinary is used for file uploads (dataset images, user profile pictures, etc.)
- Sessions are stored temporarily in memory during development. You can connect to Redis or another store for production.

---

# 🎯 That's it! Happy Building with AutoInsight!
# AutoInsight Backend

AutoInsight is a full-stack data analysis platform that helps users upload CSV files, clean their data, generate insightful charts and dashboards, and manage team collaboration. It also includes chatbot support and user feedback features.

---

## 📁 Folder Structure

```bash
.
├── index.js                # Entry point
├── .env                    # Environment variables
├── docker-compose.yml      # Local MongoDB container
├── package.json            # Node.js dependencies and scripts
└── src/
    ├── adapters/           # Email transport adapter (NodeMailer)
    ├── config/             # App configuration and Passport setup
    ├── controllers/        # Route handlers for each domain
    ├── DB/
    │   ├── config.js       # MongoDB connection logic
    │   └── models/         # Mongoose models (User, Dataset, Review, etc.)
    ├── middlewares/        # Access control, upload handling, error handlers
    ├── repositories/       # Token storage/retrieval abstraction
    ├── routes/             # Express route modules
    ├── services/           # Business logic and FastAPI integration
    └── utils/              # Helper functions (hashing, JWT, chat, etc.)
```

---

## 🚀 Features

- **User Authentication**: Signup, login, password reset, and Google OAuth2 login
- **Dataset Handling**: Upload, clean, analyze, and share datasets
- **Insight Generation**: Automatically generate charts like bar, pie, histogram, KDE, correlation maps, and forecasts
- **Chatbot Support**: Integrated with Google Gemini for text and image-based queries
- **Team Management**: Create teams, manage permissions, and assign datasets
- **Review System**: Add and analyze sentiment of user reviews
- **Notification System**: Get updates on key activities

---

## ⚙️ Tech Stack

- **Backend Framework**: Express.js
- **Authentication**: JWT, Passport.js with Google OAuth
- **Database**: MongoDB with Mongoose
- **Cloud Storage**: Cloudinary
- **Email Service**: Nodemailer
- **AI Integration**: Google Gemini (Generative AI), FastAPI (Python server for ML models)

---

## 🛠️ Installation & Usage

1. **Clone the repository**

```bash
git clone https://github.com/BishoySedra/AutoInsight_Backend.git
cd AutoInsight_Backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file and fill in your environment variables:

```env
PORT=5000
BASE_URL=/api/v1
MONGO_DB=AutoInsight
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password
MONGO_HOST=cluster0.mongodb.net
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_password
EMAIL_SERVICE=gmail
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
FASTAPI_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

4. **Start MongoDB locally using Docker** (optional if not using Atlas)

```bash
npm run dev:db
```

5. **Run the server**

```bash
npm run dev
```

The server should be live at: `http://localhost:5000/api/v1/`

---

## 🧪 Testing the API

📬 **Postman Collection URL**: `https://documenter.getpostman.com/view/32763635/2sAYQiCo4i`


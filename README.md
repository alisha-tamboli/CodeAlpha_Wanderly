# 🌍 Wanderly

Wanderly is a travel and social platform designed for users to discover destinations and share their travel experiences through posts, images, and personal stories.

## 📝 About the Project

Wanderly provides a simple platform where users can register, log in, explore travel content, and share their own experiences. The application follows a frontend-backend architecture, where the frontend handles the user interface and the backend manages APIs, authentication, and database operations.

The project was developed as part of a **Full Stack Development Internship** to gain practical experience in building a complete web application.

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB

### Image & Media Management
* Cloudinary

* Cloudinary is used to store and manage travel images uploaded through the application

### Tools

* Visual Studio Code
* MongoDB Compass
* Postman
* Git & GitHub

## ⚙️ How It Works

1. Users open the Wanderly website and create an account or log in.
2. The frontend sends requests to the Express.js backend.
3. The backend processes the requests and communicates with MongoDB.
4. User and travel-related data is stored in MongoDB.
5. The backend sends the required response back to the frontend.
6. The frontend displays the information to the user.

### Application Flow

```text
User
  ↓
Frontend
  ↓
Express.js / Node.js Backend
  ↓
MongoDB
  ↓
Backend Response
  ↓
Frontend
```

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Wanderly.git
```

### 2. Open the Project

```bash
cd Wanderly
```

### 3. Install Backend Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend/project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not upload the `.env` file to GitHub.

### 5. Start the Backend

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Open the Frontend

Open the frontend using **Live Server** in VS Code or your configured frontend server.

For example:

```text
http://127.0.0.1:5500
```

The frontend communicates with the backend running on **port 5000**.

## 📁 Project Structure

```text
Wanderly/
│
├── frontend/
│   ├── html/
│   ├── css/
│   └── js/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

> Folder names may vary according to the final project structure.

## 🔐 Environment & Security

Sensitive information such as MongoDB credentials, JWT secrets, and API keys should be stored in the `.env` file and excluded from GitHub using `.gitignore`.

## 👩‍💻 Developer

**Alisha Tamboli**

Full Stack Development Intern

---

*Wanderly — Discover places. Share experiences. Explore the world.* 🌍✈️

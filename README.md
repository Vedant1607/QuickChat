<div align="center">

# 💬 QuickChat

**Real-time chat with instant messaging, live user status, and seamless media sharing**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

[Features](#-features) • [Tech Stack](#️-tech-stack) • [Quick Start](#-quick-start) • [Deployment](#-deployment)

</div>

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 💬 **Real-Time Messaging** - Instant delivery via Socket.io with message persistence
- 👥 **Live User Status** - See who's online/offline in real-time
- 📸 **Media Sharing** - Upload and share images with Cloudinary integration
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and smooth animations
- 📱 **Mobile Ready** - Works seamlessly across all device sizes

---

## 🏗️ Tech Stack

**Frontend:** React 19 • TypeScript • Vite 7 • Tailwind CSS 4 • Socket.io Client • React Router v7

**Backend:** Node.js • Express 5 • TypeScript • Socket.io • MongoDB + Mongoose • JWT • Cloudinary • Zod

**Deployment:** Vercel (Frontend) • Render (Backend) • MongoDB Atlas

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB (local or Atlas)
- Cloudinary account

### Setup in 3 Steps

**1. Clone and Install**
```bash
git clone https://github.com/Vedant1607/QuickChat.git
cd QuickChat

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

**2. Configure Environment Variables**

Create `server/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `client/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

**3. Run the Application**
```bash
# Terminal 1 - Start backend
cd server
npm run build
npm start

# Terminal 2 - Start frontend
cd client
npm run dev
```

Open `http://localhost:5173` and start chatting! 🎉

---

## 📁 Project Structure

```
QuickChat/
├── client/                 # React frontend
│   ├── context/           # AuthContext, ChatContext
│   └── src/
│       ├── components/    # Reusable components
│       ├── pages/         # HomePage, LoginPage, ProfilePage
│       └── lib/           # Axios configuration
│
└── server/                # Express backend
    └── src/
        ├── controllers/   # Business logic
        ├── models/        # Mongoose schemas
        ├── routes/        # API endpoints
        └── middlewares/   # Auth & validation
```

---

## 📡 API Overview

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/check` - Verify authentication
- `PUT /api/auth/update-profile` - Update profile

### Messaging
- `GET /api/messages/users` - Get all users
- `GET /api/messages/:userId` - Get chat history
- `POST /api/messages/send/:userId` - Send message

### WebSocket Events
- `getOnlineUsers` - Real-time online user updates
- `newMessage` - Instant message delivery

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Set Root Directory to `client`
4. Add environment variable: `VITE_BACKEND_URL`
5. Deploy!

### Backend (Render)
1. Create Web Service on [render.com](https://render.com)
2. Set Root Directory to `server`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add all environment variables
6. Deploy!

---

## 🛠️ Development Commands

**Client:**
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run linter

**Server:**
- `npm run dev` - TypeScript watch mode
- `npm run build` - Compile TypeScript
- `npm start` - Run production server

---

## 🤝 Contributing

Contributions are welcome! Fork the repo, create a feature branch, and submit a PR.

---

## 📝 License

ISC License

---

<div align="center">

**Made with ❤️ by [Vedant Sinha](https://github.com/Vedant1607)**

⭐ Star this repo if you found it helpful!

</div>

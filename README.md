# Job Application Tracker 📋

A full-stack MERN application to track job applications with authentication, profile management, file uploads, and analytics dashboard.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with JWT
- Secure password encryption with bcryptjs
- Protected routes and private API endpoints
- Profile management with avatar upload
- Password change functionality

### 👤 User Profile
- Profile editing (name, location, phone, bio)
- Avatar upload and management
- Resume upload and download
- Social profiles (LinkedIn, GitHub)
- Account statistics and creation date

### 📊 Dashboard Analytics
- Real-time application statistics
- Interactive bar charts using Recharts
- Status distribution visualization
- Quick overview cards (Total, Interviews, Offers, Rejected)
- Responsive design for all devices

### 📝 Application Management
- **Create**: Add new job applications with details
- **Read**: View all applications with filtering
- **Update**: Modify application status, notes, and details
- **Delete**: Remove applications with confirmation
- **Attachments**: Upload and download resume/cover letters for each application
- **Search & Filter**: Filter by status and date

### 📁 File Management
- Avatar upload and display
- Resume upload (PDF, DOC, DOCX)
- Cover letter upload for applications
- Secure file storage and downloads
- File size validation (max 5MB)

### 🎨 UI/UX Features
- Responsive design with Tailwind CSS
- Modern and clean interface
- Toast notifications for feedback
- Loading states and spinners
- Form validation on frontend and backend
- Modal dialogs for editing
- Tab-based navigation

## 🚀 Tech Stack

### **Frontend**
- **React 19** - UI library
- **React Router v7** - Routing and navigation
- **Tailwind CSS v4** - Utility-first styling
- **Recharts** - Interactive data visualization
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Toast notifications
- **date-fns** - Date formatting
- **Vite** - Fast build tool and dev server

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB Atlas account (free tier available)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/job-tracker.git
cd jobApplicationTracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Create .env file in server directory
```

**Backend .env file:**
```env
MONGOURI=mongodb+srv://username:password@cluster.mongodb.net/jobtracker
PORT=8000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
```

```bash
# Start backend server
npm run dev
```

**Backend will run on:** `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd client

# Install dependencies
npm install

# Create .env file in client directory
```

**Frontend .env file (Local Development):**
```env
# Leave empty for local development - uses Vite proxy
# Only set VITE_API_URL for production (Render)
```

```bash
# Start React development server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

## 🔄 Environment Variables

### Backend (.env)
```env
# Database
MONGOURI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Server
PORT=8000
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local - Local Development)
```env
# Leave empty for local development
# Frontend uses Vite proxy to backend
```

### Frontend (.env - Production/Render)
```env
VITE_API_URL=https://your-backend.onrender.com
```

## 📁 Project Structure

```
jobApplicationTracker/
│
├── server/
│   ├── controller/
│   │   ├── authController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── applicationRoutes.js
│   ├── utils/
│   │   └── multer.js
│   ├── db/
│   │   └── db.js
│   ├── uploads/
│   │   ├── avatars/
│   │   ├── resumes/
│   │   └── cover-letters/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Profile.jsx
    │   │   ├── ProfileModal.jsx
    │   │   ├── ApplicationList.jsx
    │   │   ├── AddApplication.jsx
    │   │   ├── StatsCard.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🔧 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | User login | ❌ |
| GET | `/api/v1/auth/profile` | Get current user profile | ✅ |
| PUT | `/api/v1/auth/profile` | Update user profile | ✅ |
| PUT | `/api/v1/auth/change-password` | Change password | ✅ |
| POST | `/api/v1/auth/avatar` | Upload avatar | ✅ |
| DELETE | `/api/v1/auth/avatar` | Delete avatar | ✅ |
| GET | `/api/v1/auth/avatar-display` | Display user avatar | ✅ |
| POST | `/api/v1/auth/resume` | Upload resume | ✅ |
| DELETE | `/api/v1/auth/resume` | Delete resume | ✅ |
| GET | `/api/v1/auth/resume/:filename` | Download resume | ✅ |

### Applications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------|
| GET | `/api/v1/applications` | Get all applications | ✅ |
| POST | `/api/v1/applications` | Create new application | ✅ |
| GET | `/api/v1/applications/:id` | Get single application | ✅ |
| PUT | `/api/v1/applications/:id` | Update application | ✅ |
| DELETE | `/api/v1/applications/:id` | Delete application | ✅ |
| GET | `/api/v1/applications/stats` | Get application statistics | ✅ |
| POST | `/api/v1/applications/:id/resume` | Upload resume for application | ✅ |
| POST | `/api/v1/applications/:id/cover-letter` | Upload cover letter | ✅ |
| GET | `/api/v1/applications/files/:type/:filename` | Download file | ✅ |
| DELETE | `/api/v1/applications/:id/resume` | Delete application resume | ✅ |
| DELETE | `/api/v1/applications/:id/cover-letter` | Delete cover letter | ✅ |

## 🎯 Usage Guide

### 1. User Registration
- Navigate to `/register`
- Enter name, email, and password (min 6 characters)
- Click "Register" to create account
- Automatically logs in after registration

### 2. User Login
- Go to `/login`
- Enter registered email and password
- Access protected dashboard upon successful login

### 3. Profile Management
- Click "Profile" in dashboard navigation
- View profile details and statistics
- Click "Edit Profile Details" to:
  - Update personal information
  - Change avatar
  - Update social profiles
  - Change password
- Click "Resume Management" tab to:
  - Upload/update resume (PDF, DOC, DOCX)
  - Download resume
  - Delete resume

### 4. Add Job Application
1. Click "Add New Application" in dashboard
2. Fill in application details:
   - **Company name** (required)
   - **Position** (required)
   - Job link (optional)
   - Status (Applied/Interview/Rejected/Offer/Accepted)
   - Expected salary (optional)
   - Notes (optional)
3. Optionally upload:
   - Resume (specific to this application)
   - Cover letter
4. Click "Add Application"

### 5. Manage Applications
- **View**: All applications listed in table
- **View Details**: Click "View" to see full details
- **Edit**: Click "Edit" in detail modal to modify
- **Delete**: Click "Delete" with confirmation
- **Download Files**: Download attached resume/cover letter
- **Filter**: View filtered by status

### 6. View Analytics
- Dashboard shows real-time statistics:
  - Total applications
  - Active interviews
  - Offers received
  - Rejected applications
- Interactive bar chart shows status distribution

## 🚀 Deployment

### Backend Deployment (Render)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Render account** at https://render.com

3. **Deploy Backend:**
   - New → Web Service
   - Connect your GitHub repo
   - Build Command: `npm install`
   - Start Command: `npm run dev` or `node server.js`
   - Add environment variables:
     - `MONGOURI`: Your MongoDB connection string
     - `JWT_SECRET`: Your secret key
     - `FRONTEND_URL`: Your deployed frontend URL
     - `PORT`: 8000
     - `NODE_ENV`: production
   - Deploy

4. **Get your backend URL:** `https://your-app-name.onrender.com`

### Frontend Deployment (Render/Vercel)

#### Option 1: Render
1. New → Static Site
2. Connect your GitHub repo (client folder)
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Add environment variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com`
6. Deploy

#### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Set environment variable in Vercel dashboard:
   - `VITE_API_URL`: Your backend URL
4. Done!

## 🔐 Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **Authentication**: JWT tokens with 30-day expiration
- **Authorization**: Protected routes and API endpoints
- **CORS**: Configured for specific origins
- **File Validation**: Type and size validation
- **Error Handling**: Comprehensive error messages

## 🧪 Testing

### Manual API Testing with Postman
1. Import the API endpoints from the documentation
2. Set up environment variables for token
3. Test each endpoint with sample data

### Local Development Testing
```bash
# Test registration
POST http://localhost:8000/api/v1/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}

# Test login
POST http://localhost:8000/api/v1/auth/login
Body: {
  "email": "test@example.com",
  "password": "test123"
}
```

## 🔄 Development Workflow

### Terminal 1 - Backend
```bash
cd server
npm run dev
# Runs on http://localhost:8000
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### Terminal 3 - MongoDB (if local)
```bash
# Start MongoDB locally (if not using Atlas)
mongod
```

## 📱 Responsive Design

- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

## 🐛 Troubleshooting

### Avatar/Resume not displaying?
- Check `VITE_API_URL` environment variable
- Ensure `FRONTEND_URL` in backend .env matches frontend URL
- Clear browser cache and refresh

### 404 errors on API calls?
- Verify backend is running on correct port
- Check environment variables
- Restart both frontend and backend

### Database connection errors?
- Verify MongoDB connection string
- Check if IP is whitelisted in MongoDB Atlas
- Ensure database name is correct

### CORS errors?
- Update `FRONTEND_URL` in backend `.env`
- Ensure no trailing slashes in URLs
- Restart backend server

## 📈 Future Enhancements

- [ ] Email notifications for status updates
- [ ] Calendar view for interview dates
- [ ] Advanced filtering and search
- [ ] Export applications to PDF/CSV
- [ ] Dark mode toggle
- [ ] Real-time notifications
- [ ] Mobile app (React Native)


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request




## ⭐ Support

If you find this project helpful, please give it a star on GitHub! It helps other developers discover this resource.


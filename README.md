# 💄 BIB - Beauty Booking Application

A modern, full-stack beauty booking platform built with React and Express.js. Book appointments for beauty treatments including Botulinum Toxin, Chemical Peels, Dermal Fillers, and more.

## 🚀 Live Demo
- **Frontend**: [Deployed on Render](https://your-app.onrender.com)
- **API**: REST endpoints with JWT authentication

## ✨ Features

### 👥 **For Customers**
- 📅 **Online Booking**: Browse services and book appointments
- 🗓️ **Interactive Calendar**: Select preferred dates and times
- 💷 **Transparent Pricing**: Clear pricing for all treatments
- 📱 **Mobile Responsive**: Works perfectly on all devices
- ✅ **Booking Confirmation**: Instant confirmation with cancel token

### 👨‍💼 **For Admins**
- 🏠 **Dashboard**: Overview of all bookings and revenue
- 📊 **Calendar Management**: Visual calendar with FullCalendar
- 🚫 **Blackout Dates**: Block unavailable periods
- 📧 **Customer Management**: View client details and booking history
- 🔒 **Secure Authentication**: JWT-based admin login

### 🛡️ **Security & Performance**
- 🔐 **JWT Authentication** with httpOnly cookies
- 🚦 **Rate Limiting** to prevent abuse
- 🔒 **Input Validation** with Zod schemas
- 📈 **Optimized Database** queries with Prisma ORM
- 🛡️ **Security Headers** via Helmet.js

## 🏗️ Tech Stack

### **Frontend**
- ⚛️ **React 19.1.1** - Modern UI library
- 🎨 **Tailwind CSS 4** - Utility-first styling
- ⚡ **Vite 7** - Lightning-fast build tool
- 🧭 **React Router 7** - Client-side routing
- 📅 **FullCalendar** - Interactive calendar component
- 🗓️ **React Day Picker** - Date selection

### **Backend**
- 🟢 **Node.js + Express.js** - Server framework
- 🗄️ **PostgreSQL + Prisma** - Database with type-safe ORM
- 🔐 **JWT + bcrypt** - Authentication & password hashing
- 🚦 **Express Rate Limit** - API protection
- 🛡️ **Helmet + CORS** - Security middleware

### **DevOps**
- 🚀 **Render** - Cloud deployment platform
- 🧪 **Jest + Vitest** - Testing frameworks
- 📦 **npm workspaces** - Monorepo management

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

## 🛠️ Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/gaughey2000/BIBapp.git
cd BIBapp
```

### 2. **Install Dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies  
cd ../server && npm install
```

### 3. **Environment Setup**

Create environment files:

**Server (.env)**:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bib_db"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

**Client (.env)**:
```env
# API Base URL
VITE_API_URL="http://localhost:3001"
```

### 4. **Database Setup**
```bash
cd server

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:dev

# Seed with sample data
npm run seed
```

### 5. **Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd client  
npm run dev
# Client runs on http://localhost:5173
```

### 6. **Access the Application**
- 🌐 **Frontend**: http://localhost:5173
- 🔌 **API**: http://localhost:3001/api
- 👨‍💼 **Admin Login**: `admin@bib.com` / `bibpassword`

## 📂 Project Structure

```
BIB/
├── 📁 client/                    # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable UI components
│   │   ├── 📁 pages/            # Page components
│   │   ├── 📁 auth/             # Authentication context
│   │   ├── 📁 __tests__/        # Frontend tests
│   │   └── 📄 api.js            # API client functions
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📁 server/                    # Express.js backend  
│   ├── 📁 src/
│   │   ├── 📁 config/           # Environment configuration
│   │   ├── 📁 middleware/       # Express middleware
│   │   ├── 📁 utils/            # Utility functions
│   │   └── 📄 app.js            # Main application file
│   ├── 📁 prisma/               # Database schema & migrations
│   ├── 📁 tests/                # Backend tests
│   └── 📄 package.json
└── 📄 package.json              # Root workspace config
```

## 🧪 Testing

### **Run All Tests**
```bash
npm test
```

### **Frontend Tests**
```bash
cd client
npm test
```

### **Backend Tests**
```bash
cd server
npm test
```

## 🚀 Deployment

### **Render Deployment**

1. **Connect Repository**: Link your GitHub repo to Render
2. **Environment Variables**: Set all required env vars in Render dashboard
3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `/`

### **Database Migration**
```bash
# Production migration
npm run prisma:deploy
```

## 📡 API Documentation

### **Public Endpoints**
```http
GET    /api/services           # List all services
GET    /api/services/:id       # Get service details
GET    /api/availability       # Check availability
POST   /api/bookings           # Create booking
DELETE /api/bookings/:token    # Cancel booking
```

### **Admin Endpoints** (Requires Authentication)
```http
POST   /api/admin/login        # Admin login
GET    /api/admin/me           # Get current admin
GET    /api/admin/bookings     # List all bookings
DELETE /api/admin/bookings/:id # Cancel booking
POST   /api/admin/blackouts    # Create blackout
GET    /api/admin/blackouts    # List blackouts
DELETE /api/admin/blackouts/:id # Delete blackout
```

## 🔧 Available Scripts

### **Root Commands**
```bash
npm test              # Run all tests (client + server)
```

### **Client Commands**
```bash
npm run dev           # Start development server
npm run build         # Build for production  
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm test              # Run Vitest tests
```

### **Server Commands**
```bash
npm run dev           # Start with nodemon (auto-reload)
npm start             # Start production server
npm run prisma:dev    # Run database migrations
npm run prisma:deploy # Deploy migrations (production)
npm run seed          # Seed database with sample data
npm test              # Run Jest tests
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`  
5. **Open** a Pull Request

## 🐛 Troubleshooting

### **Common Issues**

**Build Fails on Render**
- ✅ Check JSX syntax errors
- ✅ Ensure all dependencies are in package.json
- ✅ Verify environment variables are set

**Database Connection Issues**
- ✅ Check DATABASE_URL format
- ✅ Ensure PostgreSQL is running
- ✅ Verify database credentials

**Authentication Problems**
- ✅ Check JWT_SECRET is set
- ✅ Verify cookie settings for your domain
- ✅ Check CORS configuration

## 📄 License

This project is licensed under the **MIT License**.

## 👨‍💻 Author

**Connor McGaughey**
- GitHub: [@gaughey2000](https://github.com/gaughey2000)
- Project: [BIBapp](https://github.com/gaughey2000/BIBapp)

---

**Built with ❤️ for the beauty industry** 💄✨
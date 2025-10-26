# 🚀 Start Local Development Servers

## Quick Start (Two Terminal Windows)

### Terminal 1 - Backend Server
```bash
cd ~/Developer/BIB/server
npm run dev
```

**You should see:**
```
╔══════════════════════════════════════════════════════════════════╗
║               🚀 BIB Server Running                             ║
╚══════════════════════════════════════════════════════════════════╝

  📍 Mode:        development
  🔌 Port:        4000
  🗄️  Database:    ✅ Connected
  ...
```

**Keep this terminal open!**

---

### Terminal 2 - Frontend Server
```bash
cd ~/Developer/BIB/client
npm run dev
```

**You should see:**
```
  VITE v7.1.12  ready in 276 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Keep this terminal open!**

---

## Open Your Browser

Navigate to: **http://localhost:5173**

---

## Stop Servers

In each terminal, press: **Ctrl+C**

---

## Alternative - One Command (Root Directory)

If you prefer to run both from one terminal:

```bash
cd ~/Developer/BIB
npm run dev
```

This runs both servers concurrently.

---

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Kill processes on those ports
lsof -ti:4000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

Then try starting again.

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# If not running, start it (if using Homebrew):
brew services start postgresql@14
```

---

## Full Restart from Scratch

```bash
# 1. Kill any existing processes
pkill -f "node.*server"
pkill -f vite

# 2. Start backend (Terminal 1)
cd ~/Developer/BIB/server
npm run dev

# 3. Start frontend (Terminal 2)  
cd ~/Developer/BIB/client
npm run dev

# 4. Open browser
open http://localhost:5173
```

---

## What You Should See

- **Backend**: Running on http://localhost:4000
- **Frontend**: Running on http://localhost:5173
- **Browser**: BIB clinic homepage with navigation, services, etc.

---

## Admin Login

- **URL**: http://localhost:5173/admin/login
- **Email**: bib@admin.com
- **Password**: Check your server/.env file for the password

---

**That's it! Two terminals, two commands, and you're running! 🎉**

# Staff Attendance System - Setup Guide

## Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional)

### Step 1: Install Dependencies

```bash
# Navigate to backend folder
cd web-app/backend

# Install npm packages
npm install
```

### Step 2: Start the Server

```bash
# Start the Express server
node server.js

# Output should show:
# 🚀 ========================================
# 📊 Staff Attendance System Server
# ========================================
# ✅ Server running on http://localhost:3000
```

### Step 3: Open in Browser

- Open your web browser
- Navigate to: **http://localhost:3000**
- The system should load with the Dashboard

---

## First Time Usage

### 1. Add Employees

1. Go to **Employees** tab
2. Fill in the form:
   - Employee ID: `EMP001`
   - Full Name: `John Doe`
   - Department: `IT`
   - Email: `john@company.com`
3. Click "Add Employee"
4. Repeat for other employees

### 2. Record Attendance

1. Go to **Attendance** tab
2. Select an employee from the dropdown
3. Select today's date
4. Click "Clock In" to record arrival time
5. Later, click "Clock Out" to record departure time
6. Enter any break time taken (in minutes)
7. System automatically calculates hours worked

### 3. Generate Monthly Report

1. Go to **Monthly Report** tab
2. Select an employee (or leave empty for all)
3. Select the month you want to report
4. Click "Generate Report"
5. View or download the report as CSV

---

## File Structure

```
staff-attendance-tracker/
├── web-app/
│   ├── index.html              # Main HTML interface
│   ├── css/
│   │   └── styles.css          # All styling
│   ├── js/
│   │   └── app.js              # Frontend JavaScript
│   └── backend/
│       ├── server.js           # Express backend
│       ├── package.json        # Node dependencies
│       └── attendance.db       # SQLite database (auto-created)
├── docs/
│   └── SETUP_GUIDE.md          # This file
└── README.md                   # Project overview
```

---

## Database

### Automatic Setup

- Database file `attendance.db` is automatically created on first run
- Three tables are created:
  - **employees** - Store employee information
  - **attendance** - Daily clock in/out records
  - **monthly_summary** - Aggregated monthly data

### Reset Database

To start fresh:

```bash
# Navigate to backend folder
cd web-app/backend

# Delete the database
rm attendance.db

# Restart server (will create new database)
node server.js
```

---

## API Endpoints

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Add new employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get specific employee |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance/clock-in` | Clock in |
| POST | `/api/attendance/clock-out` | Clock out |
| GET | `/api/attendance/daily/:id` | Get daily records |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance/monthly-report` | Generate monthly report |
| GET | `/api/attendance/monthly-summary` | Get all summaries |
| GET | `/api/attendance/monthly-summary/:id` | Get employee summaries |

---

## Features Explained

### Dashboard
- **Total Employees**: Count of all employees in the system
- **Present Today**: Employees who clocked in today
- **Absent Today**: Employees who didn't clock in
- **Clocked In**: Employees still at work (not clocked out)
- **Quick View**: Real-time view of today's attendance

### Daily Attendance
- **Clock In**: Records the arrival time
- **Clock Out**: Records the departure time
- **Break Time**: Deducted from hours worked
- **Auto Calculation**: Hours worked = (Clock Out - Clock In) - Break
- **Records Table**: Shows last 30 days of attendance

### Monthly Report
- **Total Days**: Total working days in the month
- **Days Present**: Actual attendance count
- **Days Absent**: Missing attendance count
- **Total Hours**: Sum of all hours worked
- **Attendance %**: (Days Present / Total Days) × 100
- **Download CSV**: Export data for Excel/analysis
- **Print Report**: Print formatted report

### Employee Management
- **Add Employee**: Register new staff members
- **Employee List**: View all employees in database
- **Department Tracking**: Organize by department
- **Email Records**: Store contact information

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
PORT=3001 node server.js

# Then access at http://localhost:3001
```

### Module Not Found Error

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Locked Error

```bash
# Close all instances and restart
# Make sure only one server is running
node server.js
```

### Not Seeing Changes

```bash
# Hard refresh the browser (Clear cache)
Ctrl + Shift + Delete  # Windows/Linux
Cmd + Shift + Delete   # Mac

# Or use:
Ctrl + F5  # Windows/Linux
Cmd + Shift + R  # Mac
```

---

## Keyboard Shortcuts

- **Ctrl + 1**: Go to Dashboard
- **Ctrl + 2**: Go to Attendance
- **Ctrl + 3**: Go to Monthly Report
- **Ctrl + 4**: Go to Employees

---

## Performance Tips

1. **Regular Backups**: Copy `attendance.db` periodically
2. **Archive Old Data**: For large databases, archive monthly data
3. **Browser Cache**: Clear cache monthly for optimal performance
4. **Database Cleanup**: Remove records older than 2 years

---

## Support & Maintenance

### Common Tasks

#### Export Monthly Data
1. Go to Monthly Report tab
2. Select month and employee
3. Click "Download CSV"
4. Open in Excel for analysis

#### Print Reports
1. Go to Monthly Report tab
2. Generate report
3. Click "Print Report"
4. Select printer and options

#### Modify Employee Info
1. Currently done via database directly
2. Or delete and re-add employee

---

## Development Mode

For development with auto-reload:

```bash
cd web-app/backend
npm install -g nodemon
npm run dev
```

---

## Version Info

- **Version**: 1.0.0
- **Last Updated**: 2026
- **License**: MIT
- **Node Version**: v14+
- **Database**: SQLite3

---

## Next Steps

1. Add your employees
2. Start recording daily attendance
3. Generate first monthly report at month-end
4. Analyze patterns and trends
5. Maintain regular backups

---

**Happy Tracking! 📊**

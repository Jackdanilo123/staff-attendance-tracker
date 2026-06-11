# Staff Attendance Tracking System

An automated HR system for tracking employee attendance with daily time calculations and monthly aggregated reports.

## Features

✅ **Daily Attendance Tracking**
- Clock-in and Clock-out time recording
- Automatic calculation of daily hours worked
- Resumption time and closing time tracking
- Break time management

✅ **Monthly Attendance Reports**
- Aggregated monthly attendance summary
- Total hours worked per employee
- Attendance percentage
- Late arrivals and early departures tracking

✅ **Employee Management**
- Add and manage employees
- Department and email tracking
- Employee directory

## Quick Start

### Prerequisites
- Node.js (v14+)
- npm

### Installation

```bash
# 1. Navigate to backend folder
cd web-app/backend

# 2. Install dependencies
npm install

# 3. Start the server
node server.js

# 4. Open browser
http://localhost:3000
```

## Directory Structure

```
staff-attendance-tracker/
├── README.md
├── web-app/
│   ├── index.html              (Main web interface)
│   ├── css/
│   │   └── styles.css          (Styling)
│   ├── js/
│   │   └── app.js              (Frontend logic)
│   └── backend/
│       ├── package.json        (Dependencies)
│       └── server.js           (Express backend)
└── docs/
    └── SETUP_GUIDE.md          (Detailed setup)
```

## Usage Guide

### 1. Dashboard
- View total employees
- See today's attendance status
- Quick statistics

### 2. Daily Attendance
- Select employee and date
- Click "Clock In" to record arrival
- Click "Clock Out" to record departure
- Enter break time in minutes
- Automatic calculation of hours worked

### 3. Monthly Report
- Generate attendance reports by month
- View attendance percentage
- Download as CSV
- Print reports

### 4. Employee Management
- Add new employees
- Manage employee database
- View employee directory

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Add new employee |
| GET | `/api/employees` | Get all employees |
| POST | `/api/attendance/clock-in` | Record clock-in |
| POST | `/api/attendance/clock-out` | Record clock-out |
| GET | `/api/attendance/daily/:employee_id` | Get daily records |
| POST | `/api/attendance/monthly-report` | Generate monthly report |
| GET | `/api/attendance/monthly-summary` | Get all monthly summaries |

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Port**: 3000 (default)

## Features in Detail

### Automatic Calculations
- **Hours Worked** = (Clock Out - Clock In) - Break Time
- **Attendance %** = (Days Present / Total Days) × 100
- **Monthly Summary** = Aggregated data for the entire month

### Data Persistence
- All data stored in SQLite database (`attendance.db`)
- Automatic database creation on first run
- No additional setup required

## Troubleshooting

### Port 3000 already in use
```bash
# Change port in server.js or use environment variable
PORT=3001 node server.js
```

### Database errors
```bash
# Delete database and recreate
rm attendance.db
node server.js
```

## Future Enhancements

- 📱 Mobile app version
- 📧 Email notifications
- 🔔 Late arrival alerts
- 📊 Advanced analytics
- 👤 User authentication
- 🌙 Dark mode
- 📱 Responsive improvements

## License

MIT License - Feel free to use and modify

## Support

For issues or suggestions, please create an issue in the repository.

---

**Created**: 2026 | **Version**: 1.0.0

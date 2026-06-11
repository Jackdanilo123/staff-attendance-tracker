// ==========================================
// STAFF ATTENDANCE SYSTEM - BACKEND SERVER
// ==========================================

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Database Setup
const db = new sqlite3.Database('./attendance.db', (err) => {
  if (err) {
    console.error('❌ Database error:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Helper function to promisify db operations
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Create Tables
db.serialize(() => {
  // Employees Table
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      department TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Daily Attendance Table
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT NOT NULL,
      date TEXT NOT NULL,
      clock_in TEXT,
      clock_out TEXT,
      break_minutes INTEGER DEFAULT 0,
      hours_worked REAL,
      status TEXT DEFAULT 'present',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(employee_id, date),
      FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
    )
  `);

  // Monthly Summary Table
  db.run(`
    CREATE TABLE IF NOT EXISTS monthly_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT NOT NULL,
      month INTEGER,
      year INTEGER,
      total_days INTEGER,
      days_present INTEGER,
      days_absent INTEGER,
      total_hours REAL,
      attendance_percentage REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(employee_id, month, year),
      FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
    )
  `);
});

// ==========================================
// EMPLOYEE ROUTES
// ==========================================

// 1. Add Employee
app.post('/api/employees', async (req, res) => {
  try {
    const { employee_id, name, department, email } = req.body;
    
    if (!employee_id || !name) {
      return res.status(400).json({ error: 'Employee ID and Name are required' });
    }
    
    const result = await dbRun(
      'INSERT INTO employees (employee_id, name, department, email) VALUES (?, ?, ?, ?)',
      [employee_id, name, department || null, email || null]
    );
    
    res.json({ id: result.lastID, employee_id, name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Get All Employees
app.get('/api/employees', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM employees ORDER BY name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get Employee by ID
app.get('/api/employees/:employee_id', async (req, res) => {
  try {
    const { employee_id } = req.params;
    const row = await dbGet('SELECT * FROM employees WHERE employee_id = ?', [employee_id]);
    
    if (!row) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ATTENDANCE ROUTES
// ==========================================

// 4. Clock In
app.post('/api/attendance/clock-in', async (req, res) => {
  try {
    const { employee_id, date } = req.body;
    
    if (!employee_id || !date) {
      return res.status(400).json({ error: 'Employee ID and date are required' });
    }
    
    const clock_in = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    await dbRun(
      'INSERT OR IGNORE INTO attendance (employee_id, date, clock_in, status) VALUES (?, ?, ?, ?)',
      [employee_id, date, clock_in, 'present']
    );
    
    res.json({ message: 'Clocked in successfully', clock_in });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Clock Out
app.post('/api/attendance/clock-out', async (req, res) => {
  try {
    const { employee_id, date, break_minutes } = req.body;
    
    if (!employee_id || !date) {
      return res.status(400).json({ error: 'Employee ID and date are required' });
    }
    
    const clock_out = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    const row = await dbGet(
      'SELECT clock_in FROM attendance WHERE employee_id = ? AND date = ?',
      [employee_id, date]
    );
    
    if (!row) {
      return res.status(404).json({ error: 'Clock-in record not found for this date' });
    }
    
    // Calculate hours worked
    const [inHour, inMin] = row.clock_in.split(':').map(Number);
    const [outHour, outMin] = clock_out.split(':').map(Number);
    const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
    const hoursWorked = (totalMinutes - (break_minutes || 0)) / 60;
    
    await dbRun(
      'UPDATE attendance SET clock_out = ?, break_minutes = ?, hours_worked = ? WHERE employee_id = ? AND date = ?',
      [clock_out, break_minutes || 0, Math.max(0, hoursWorked), employee_id, date]
    );
    
    res.json({ message: 'Clocked out successfully', clock_out, hours_worked: hoursWorked.toFixed(2) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Get Daily Attendance
app.get('/api/attendance/daily/:employee_id', async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { month, year } = req.query;
    
    let query = 'SELECT * FROM attendance WHERE employee_id = ?';
    let params = [employee_id];
    
    if (month && year) {
      query += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
      params.push(String(month).padStart(2, '0'), year);
    }
    
    query += ' ORDER BY date DESC LIMIT 30';
    
    const rows = await dbAll(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Generate Monthly Report
app.post('/api/attendance/monthly-report', async (req, res) => {
  try {
    const { employee_id, month, year } = req.body;
    
    if (!employee_id || !month || !year) {
      return res.status(400).json({ error: 'Employee ID, month, and year are required' });
    }
    
    const monthStr = String(month).padStart(2, '0');
    const yearStr = String(year);
    
    const row = await dbGet(`
      SELECT 
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'present' AND clock_in IS NOT NULL THEN 1 ELSE 0 END) as days_present,
        SUM(CASE WHEN status = 'absent' OR clock_in IS NULL THEN 1 ELSE 0 END) as days_absent,
        COALESCE(SUM(hours_worked), 0) as total_hours
      FROM attendance 
      WHERE employee_id = ? AND strftime("%m", date) = ? AND strftime("%Y", date) = ?
    `, [employee_id, monthStr, yearStr]);
    
    const attendance_percentage = row.total_days > 0 
      ? ((row.days_present / row.total_days) * 100).toFixed(2) 
      : 0;
    
    const summary = {
      employee_id,
      month: parseInt(month),
      year: parseInt(year),
      total_days: row.total_days || 0,
      days_present: row.days_present || 0,
      days_absent: row.days_absent || 0,
      total_hours: row.total_hours ? row.total_hours.toFixed(2) : 0,
      attendance_percentage: parseFloat(attendance_percentage)
    };
    
    // Save to monthly_summary table
    await dbRun(`
      INSERT OR REPLACE INTO monthly_summary 
      (employee_id, month, year, total_days, days_present, days_absent, total_hours, attendance_percentage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      employee_id, month, year, 
      summary.total_days, summary.days_present, summary.days_absent, 
      summary.total_hours, summary.attendance_percentage
    ]);
    
    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 8. Get All Monthly Reports
app.get('/api/attendance/monthly-summary', async (req, res) => {
  try {
    const rows = await dbAll(
      'SELECT * FROM monthly_summary ORDER BY year DESC, month DESC LIMIT 100'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Get Monthly Report by Employee
app.get('/api/attendance/monthly-summary/:employee_id', async (req, res) => {
  try {
    const { employee_id } = req.params;
    const rows = await dbAll(
      'SELECT * FROM monthly_summary WHERE employee_id = ? ORDER BY year DESC, month DESC',
      [employee_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log('📊 Staff Attendance System Server');
  console.log('========================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('📱 Open browser and navigate to the URL');
  console.log('========================================\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⛔ Shutting down server...');
  db.close(() => {
    console.log('✅ Database connection closed');
    process.exit(0);
  });
});

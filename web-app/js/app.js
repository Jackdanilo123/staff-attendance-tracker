// ==========================================
// STAFF ATTENDANCE SYSTEM - FRONTEND JS
// ==========================================

const API_BASE = 'http://localhost:3000/api';
let allEmployees = [];
let currentEmployeeData = {};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  document.getElementById('attendanceDate').value = today;
  document.getElementById('reportMonth').value = currentMonth;
  
  // Load initial data
  loadEmployees();
  loadDailyAttendance();
  loadMonthlyReports();
  updateDashboard();
  showTab('dashboard');
});

// ==========================================
// TAB NAVIGATION
// ==========================================

function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Reload data based on tab
  if (tabName === 'attendance') {
    loadDailyAttendance();
  } else if (tabName === 'monthly') {
    loadMonthlyReports();
  } else if (tabName === 'dashboard') {
    updateDashboard();
  }
}

// ==========================================
// EMPLOYEE MANAGEMENT
// ==========================================

async function loadEmployees() {
  try {
    const response = await fetch(`${API_BASE}/employees`);
    const employees = await response.json();
    allEmployees = employees;
    
    // Update employee selects
    updateEmployeeSelects(employees);
    
    // Update employee table
    updateEmployeeTable(employees);
    
    // Update dashboard count
    document.getElementById('totalEmployees').textContent = employees.length;
  } catch (error) {
    console.error('Error loading employees:', error);
    showAlert('Failed to load employees', 'danger');
  }
}

function updateEmployeeSelects(employees) {
  const selects = ['employeeSelect', 'reportEmployeeSelect'];
  
  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">-- Choose Employee --</option>';
    
    employees.forEach(emp => {
      const option = document.createElement('option');
      option.value = emp.employee_id;
      option.textContent = `${emp.name} (${emp.employee_id})`;
      select.appendChild(option);
    });
    
    select.value = currentValue;
  });
}

function updateEmployeeTable(employees) {
  const tableBody = document.querySelector('#employeeTable tbody');
  
  if (employees.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No employees yet</td></tr>';
    return;
  }
  
  tableBody.innerHTML = employees.map((emp, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${emp.employee_id}</td>
      <td>${emp.name}</td>
      <td>${emp.department || 'N/A'}</td>
      <td>${emp.email || 'N/A'}</td>
      <td>${new Date(emp.created_at).toLocaleDateString()}</td>
    </tr>
  `).join('');
}

async function addEmployee() {
  const empId = document.getElementById('empId').value.trim();
  const empName = document.getElementById('empName').value.trim();
  const empDept = document.getElementById('empDept').value.trim();
  const empEmail = document.getElementById('empEmail').value.trim();
  
  // Validation
  if (!empId) {
    showAlert('Please enter Employee ID', 'warning');
    return;
  }
  if (!empName) {
    showAlert('Please enter Employee Name', 'warning');
    return;
  }
  if (empEmail && !validateEmail(empEmail)) {
    showAlert('Please enter a valid email', 'warning');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: empId,
        name: empName,
        department: empDept,
        email: empEmail
      })
    });
    
    if (response.ok) {
      showAlert(`✅ Employee "${empName}" added successfully!`, 'success');
      resetEmployeeForm();
      loadEmployees();
    } else {
      const error = await response.json();
      showAlert(`Error: ${error.error}`, 'danger');
    }
  } catch (error) {
    console.error('Error adding employee:', error);
    showAlert('Failed to add employee', 'danger');
  }
}

function resetEmployeeForm() {
  document.getElementById('empId').value = '';
  document.getElementById('empName').value = '';
  document.getElementById('empDept').value = '';
  document.getElementById('empEmail').value = '';
}

// ==========================================
// ATTENDANCE TRACKING
// ==========================================

async function clockIn() {
  const empId = document.getElementById('employeeSelect').value;
  const date = document.getElementById('attendanceDate').value;
  
  if (!empId) {
    showAlert('Please select an employee', 'warning');
    return;
  }
  
  if (!date) {
    showAlert('Please select a date', 'warning');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/attendance/clock-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: empId, date })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert(`🔵 Clocked in at ${data.clock_in}`, 'success');
      loadDailyAttendance();
      updateDashboard();
    } else {
      showAlert(`⚠️ ${data.error}`, 'warning');
    }
  } catch (error) {
    console.error('Error clocking in:', error);
    showAlert('Failed to clock in', 'danger');
  }
}

async function clockOut() {
  const empId = document.getElementById('employeeSelect').value;
  const date = document.getElementById('attendanceDate').value;
  const breakMinutes = parseInt(document.getElementById('breakMinutes').value) || 0;
  
  if (!empId) {
    showAlert('Please select an employee', 'warning');
    return;
  }
  
  if (!date) {
    showAlert('Please select a date', 'warning');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/attendance/clock-out`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: empId,
        date,
        break_minutes: breakMinutes
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert(`🔴 Clocked out at ${data.clock_out} | Hours worked: ${data.hours_worked}h`, 'success');
      document.getElementById('breakMinutes').value = '0';
      loadDailyAttendance();
      updateDashboard();
    } else {
      showAlert(`⚠️ ${data.error}`, 'warning');
    }
  } catch (error) {
    console.error('Error clocking out:', error);
    showAlert('Failed to clock out', 'danger');
  }
}

function resetAttendanceForm() {
  document.getElementById('employeeSelect').value = '';
  document.getElementById('breakMinutes').value = '0';
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('attendanceDate').value = today;
}

async function loadDailyAttendance() {
  try {
    const empId = document.getElementById('employeeSelect').value;
    const date = document.getElementById('attendanceDate').value;
    
    if (!empId || !date) {
      return;
    }
    
    const [year, month] = date.split('-');
    const response = await fetch(`${API_BASE}/attendance/daily/${empId}?month=${month}&year=${year}`);
    const records = await response.json();
    
    updateAttendanceTable(records);
    updateCurrentStatus(empId, date);
  } catch (error) {
    console.error('Error loading daily attendance:', error);
  }
}

function updateAttendanceTable(records) {
  const tableBody = document.querySelector('#attendanceTable tbody');
  
  if (records.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No records for this period</td></tr>';
    return;
  }
  
  tableBody.innerHTML = records.map(record => {
    const empName = allEmployees.find(e => e.employee_id === record.employee_id)?.name || record.employee_id;
    const statusClass = record.status === 'present' ? 'present' : 'absent';
    const hoursWorked = record.hours_worked ? record.hours_worked.toFixed(2) : '--';
    
    return `
      <tr>
        <td>${empName}</td>
        <td>${record.date}</td>
        <td>${record.clock_in || '--'}</td>
        <td>${record.clock_out || '--'}</td>
        <td>${record.break_minutes || 0}</td>
        <td>${hoursWorked}</td>
        <td><span class="status-badge ${statusClass}">${record.status}</span></td>
      </tr>
    `;
  }).join('');
}

async function updateCurrentStatus(empId, date) {
  try {
    const response = await fetch(`${API_BASE}/attendance/daily/${empId}`);
    const records = response.ok ? await response.json() : [];
    
    const todayRecord = records.find(r => r.date === date);
    const statusDiv = document.getElementById('currentStatus');
    
    if (todayRecord) {
      const status = todayRecord.clock_out ? 'Clocked Out' : 'Clocked In';
      const statusClass = todayRecord.status === 'present' ? 'clocked-in' : 'absent';
      
      statusDiv.innerHTML = `
        <div class="status-box">
          <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${status}</span></p>
          <p><strong>Clock In:</strong> ${todayRecord.clock_in || 'Not recorded'}</p>
          <p><strong>Clock Out:</strong> ${todayRecord.clock_out || 'Not recorded'}</p>
          <p><strong>Break:</strong> ${todayRecord.break_minutes || 0} minutes</p>
          <p><strong>Hours Worked:</strong> ${todayRecord.hours_worked ? todayRecord.hours_worked.toFixed(2) : '--'} hours</p>
        </div>
      `;
    } else {
      statusDiv.innerHTML = '<div class="status-box"><p>No records for selected date</p></div>';
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

// ==========================================
// MONTHLY REPORTS
// ==========================================

async function generateMonthlyReport() {
  const empId = document.getElementById('reportEmployeeSelect').value;
  const monthInput = document.getElementById('reportMonth').value;
  
  if (!monthInput) {
    showAlert('Please select a month', 'warning');
    return;
  }
  
  const [year, month] = monthInput.split('-');
  
  try {
    let response;
    
    if (empId) {
      response = await fetch(`${API_BASE}/attendance/monthly-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: empId,
          month: parseInt(month),
          year: parseInt(year)
        })
      });
    } else {
      response = await fetch(`${API_BASE}/attendance/monthly-summary`);
    }
    
    const data = await response.json();
    
    if (response.ok) {
      if (empId) {
        displayMonthlyReportTable([data]);
      } else {
        // Filter reports for selected month
        const filteredData = Array.isArray(data) ? data.filter(r => 
          r.month === parseInt(month) && r.year === parseInt(year)
        ) : [];
        displayMonthlyReportTable(filteredData);
      }
      
      showAlert('✅ Report generated successfully', 'success');
      document.getElementById('reportStats').style.display = 'block';
      updateReportStatistics(Array.isArray(data) ? data : [data]);
    } else {
      showAlert('Failed to generate report', 'danger');
    }
  } catch (error) {
    console.error('Error generating report:', error);
    showAlert('Error generating report', 'danger');
  }
}

async function loadMonthlyReports() {
  try {
    const response = await fetch(`${API_BASE}/attendance/monthly-summary`);
    const reports = await response.json();
    
    if (reports && reports.length > 0) {
      displayMonthlyReportTable(reports.slice(0, 10));
    } else {
      document.querySelector('#monthlyReportTable tbody').innerHTML = 
        '<tr><td colspan="8" style="text-align: center; color: #999;">No reports available</td></tr>';
    }
  } catch (error) {
    console.error('Error loading monthly reports:', error);
  }
}

function displayMonthlyReportTable(reports) {
  const tableBody = document.querySelector('#monthlyReportTable tbody');
  
  if (reports.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999;">No data found</td></tr>';
    return;
  }
  
  tableBody.innerHTML = reports.map(report => {
    const empName = allEmployees.find(e => e.employee_id === report.employee_id)?.name || report.employee_id;
    const monthName = new Date(report.year, report.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return `
      <tr>
        <td>${report.employee_id}</td>
        <td>${empName}</td>
        <td>${monthName}</td>
        <td>${report.total_days}</td>
        <td>${report.days_present}</td>
        <td>${report.days_absent}</td>
        <td>${report.total_hours ? report.total_hours.toFixed(2) : 0}</td>
        <td>${report.attendance_percentage}%</td>
      </tr>
    `;
  }).join('');
}

function updateReportStatistics(reports) {
  if (reports.length === 0) return;
  
  const totalEmps = reports.length;
  const avgAttendance = (reports.reduce((sum, r) => sum + parseFloat(r.attendance_percentage || 0), 0) / totalEmps).toFixed(2);
  const totalHours = reports.reduce((sum, r) => sum + parseFloat(r.total_hours || 0), 0).toFixed(2);
  
  document.getElementById('statTotalEmps').textContent = totalEmps;
  document.getElementById('statAvgAttendance').textContent = avgAttendance + '%';
  document.getElementById('statTotalHours').textContent = totalHours;
}

function downloadMonthlyReport() {
  const table = document.getElementById('monthlyReportTable');
  const rows = table.querySelectorAll('tr');
  
  let csv = 'Employee ID,Employee Name,Month,Total Days,Days Present,Days Absent,Total Hours,Attendance %\n';
  
  rows.forEach(row => {
    if (row.querySelector('th')) return;
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(cell => `"${cell.textContent.trim()}"`).join(',');
    csv += rowData + '\n';
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  showAlert('✅ Report downloaded successfully', 'success');
}

function printMonthlyReport() {
  const table = document.getElementById('monthlyReportTable').outerHTML;
  const printWindow = window.open('', '', 'width=900,height=600');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Monthly Attendance Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        table, th, td { border: 1px solid #333; padding: 10px; }
        th { background: #667eea; color: white; }
        h2 { color: #333; }
      </style>
    </head>
    <body>
      <h2>📊 Monthly Attendance Report</h2>
      <p>Generated: ${new Date().toLocaleString()}</p>
      ${table}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// ==========================================
// DASHBOARD
// ==========================================

async function updateDashboard() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${API_BASE}/employees`);
    const employees = await response.json();
    
    let presentCount = 0;
    let absentCount = 0;
    let clockedInCount = 0;
    let todayRecords = [];
    
    // Fetch attendance for each employee
    for (const emp of employees) {
      const attResponse = await fetch(`${API_BASE}/attendance/daily/${emp.employee_id}`);
      const records = attResponse.ok ? await attResponse.json() : [];
      
      const todayRecord = records.find(r => r.date === today);
      if (todayRecord) {
        if (todayRecord.status === 'present') {
          presentCount++;
          if (!todayRecord.clock_out) {
            clockedInCount++;
          }
        } else {
          absentCount++;
        }
        todayRecords.push({ ...todayRecord, name: emp.name });
      }
    }
    
    document.getElementById('presentToday').textContent = presentCount;
    document.getElementById('absentToday').textContent = absentCount;
    document.getElementById('clockedInToday').textContent = clockedInCount;
    
    // Update quick view
    updateTodayQuickView(todayRecords);
  } catch (error) {
    console.error('Error updating dashboard:', error);
  }
}

function updateTodayQuickView(records) {
  const quickView = document.getElementById('todayAttendance');
  
  if (records.length === 0) {
    quickView.innerHTML = '<p style="text-align: center; color: #999;">No attendance records today</p>';
    return;
  }
  
  quickView.innerHTML = records.map(record => {
    const statusClass = record.status === 'present' ? 'present' : 'absent';
    const clockStatus = record.clock_out ? 'Clocked Out' : (record.clock_in ? 'Clocked In' : 'Pending');
    
    return `
      <div class="quick-view-item">
        <strong>${record.name}</strong>
        <div>
          <span class="status-badge ${statusClass}">${clockStatus}</span>
          <span style="margin-left: 10px; color: #666; font-size: 0.9em;">${record.clock_in || '--'} to ${record.clock_out || '--'}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// UTILITIES
// ==========================================

function showAlert(message, type = 'info') {
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alert.style.position = 'fixed';
  alert.style.top = '20px';
  alert.style.right = '20px';
  alert.style.zIndex = '9999';
  alert.style.maxWidth = '400px';
  alert.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
  
  document.body.appendChild(alert);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.3s';
    setTimeout(() => alert.remove(), 300);
  }, 4000);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === '1') { e.preventDefault(); showTab('dashboard'); }
    if (e.key === '2') { e.preventDefault(); showTab('attendance'); }
    if (e.key === '3') { e.preventDefault(); showTab('monthly'); }
    if (e.key === '4') { e.preventDefault(); showTab('employees'); }
  }
});

console.log('%cStaff Attendance System Ready', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cKeyboard Shortcuts: Ctrl+1 Dashboard, Ctrl+2 Attendance, Ctrl+3 Monthly, Ctrl+4 Employees', 'color: #666; font-size: 12px;');

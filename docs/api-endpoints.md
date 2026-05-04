# API Endpoints Documentation

## Authentication & Registration

### POST /auth/signup
**Description:** Register a new employee account  
**Request Body:**
```json
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@company.com",
  "password": "securePassword123",
  "department": "Engineering",
  "position": "Software Developer"
}
```
**Response:** `201 Created` - Account created, pending HR approval

### POST /auth/login
**Description:** Login for all roles  
**Request Body:**
```json
{
  "email": "john@company.com",
  "password": "securePassword123"
}
```
**Response:** `200 OK` - JWT token + user info

### POST /auth/forgot-password
**Description:** Request password reset

### POST /auth/reset-password
**Description:** Reset password with token

---

## Attendance Management

### POST /attendance/log
**Description:** Log check-in or check-out  
**Request Body:**
```json
{
  "type": "check_in", // or "check_out"
  "timestamp": "2024-01-15T08:00:00Z"
}
```
**Response:** `200 OK` - Attendance logged

### GET /attendance/today
**Description:** Get today's attendance status for current user  
**Response:**
```json
{
  "has_checked_in": true,
  "check_in_time": "08:00:00",
  "check_out_time": null,
  "status": "present"
}
```

### GET /attendance/history
**Description:** Get attendance history (with filters)  
**Query Params:** `?month=1&year=2024&user_id=1`

### PUT /attendance/:id
**Description:** Update attendance record (HR only)

---

## Leave Management

### POST /leaves/request
**Description:** Submit leave request  
**Request Body:**
```json
{
  "leave_type": "annual",
  "start_date": "2024-02-01",
  "end_date": "2024-02-03",
  "reason": "Family vacation"
}
```

### GET /leaves/my-requests
**Description:** Get current user's leave requests

### GET /leaves/pending
**Description:** Get all pending leave requests (HR only)

### PUT /leaves/:id/approve
**Description:** Approve leave request (HR only)

### PUT /leaves/:id/reject
**Description:** Reject leave request (HR only)

### GET /leaves/balance
**Description:** Get remaining leave quota for current user

---

## Performance Analytics

### GET /performance/summary
**Description:** Get performance summary for all employees (HR/Owner only)  
**Response:**
```json
[
  {
    "user_id": 1,
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "department": "Engineering",
    "attendance_percentage": 96.5,
    "late_count": 1,
    "performance_label": "Baik",
    "approved_leaves_this_month": 2
  }
]
```

### GET /performance/:userId
**Description:** Get detailed performance for specific employee

### GET /performance/department/:deptId
**Description:** Get performance metrics by department

---

## Payroll Management

### GET /payroll/current
**Description:** Get current month payroll for current user

### GET /payroll/history
**Description:** Get payroll history for current user

### POST /payroll/calculate
**Description:** Calculate payroll for all employees (HR only)  
**Request Body:**
```json
{
  "month": 1,
  "year": 2024
}
```

### GET /payroll/monthly-summary
**Description:** Get total payroll expenditure per month (Owner only)  
**Query Params:** `?year=2024`

### GET /payroll/department-comparison
**Description:** Compare payroll and performance across departments (Owner only)

### PUT /payroll/:id/pay
**Description:** Mark payroll as paid (HR only)

---

## User Management (HR Only)

### GET /users
**Description:** Get all users with filters

### GET /users/pending
**Description:** Get pending user registrations

### PUT /users/:id/activate
**Description:** Activate a pending user account

### PUT /users/:id/deactivate
**Description:** Deactivate a user account

### PUT /users/:id
**Description:** Update user information

### DELETE /users/:id
**Description:** Delete a user account

---

## Dashboard Widgets

### GET /dashboard/employee
**Description:** Get employee dashboard data  
**Response:**
```json
{
  "attendance_status": "not_checked_in",
  "remaining_leave": 8,
  "total_leaves_this_month": 2,
  "total_working_hours": 160,
  "performance_label": "Baik"
}
```

### GET /dashboard/hr
**Description:** Get HR dashboard data  
**Response:**
```json
{
  "pending_registrations": 3,
  "pending_leave_requests": 5,
  "today_present": 45,
  "today_late": 2,
  "total_employees": 50
}
```

### GET /dashboard/owner
**Description:** Get Owner dashboard data  
**Response:**
```json
{
  "total_employees": 50,
  "monthly_payroll_total": 250000000,
  "average_attendance": 94.5,
  "department_performance": [...]
}
```

---

## Notification & Email

### POST /notifications/email-test
**Description:** Test email configuration (Admin only)

### GET /notifications/history
**Description:** Get notification history

---

## System Configuration

### GET /settings
**Description:** Get system settings

### PUT /settings
**Description:** Update system settings (e.g., work hours, late threshold)

### GET /settings/work-hours
**Description:** Get configured work hours and late thresholds

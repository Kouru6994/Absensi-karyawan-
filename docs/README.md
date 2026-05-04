# Integrated HR Management System - Technical Documentation

## Project Overview
**Sistem Manajemen SDM Terintegrasi (Absensi, Gaji, & Performa)**

A comprehensive web application with 3 distinct portals (Employee, HR, Owner) focused on operational efficiency and data-driven performance monitoring.

---

## Table of Contents

1. [Database Design](#database-design)
2. [API Endpoints](#api-endpoints)
3. [Frontend Logic](#frontend-logic)
4. [Performance Analysis](#performance-analysis)
5. [Email Workflow](#email-workflow)
6. [Payroll Calculation](#payroll-calculation)

---

## Database Design

### Schema Location
`/workspace/database/schema.sql`

### Core Tables

#### 1. Users Table
- Stores all user accounts with role-based access control
- Supports three roles: `employee`, `hr`, `owner`
- Account status workflow: `pending` → `active` → `inactive`
- Includes salary information for payroll calculations

#### 2. Attendance Table
- Tracks daily check-in/check-out times
- Automatically calculates late arrivals based on configured work hours
- Status tracking: `present`, `late`, `absent`, `half_day`
- Unique constraint per user per day

#### 3. Leaves Table
- Manages employee leave requests
- Multiple leave types: `annual`, `sick`, `unpaid`, `maternity`, `other`
- Approval workflow with HR authorization
- Tracks approved leaves for payroll deductions

#### 4. Payroll Table
- Monthly salary calculations
- Automatic deduction calculations for leaves and late arrivals
- Payment status tracking
- Historical records for auditing

#### 5. Performance Summary View
- Real-time performance metrics aggregation
- Calculates attendance percentage and late counts
- Used for performance labeling algorithm

---

## API Endpoints

### Documentation Location
`/workspace/docs/api-endpoints.md`

### Key Endpoints by Category

#### Authentication
- `POST /auth/signup` - New employee registration
- `POST /auth/login` - Login for all roles
- `POST /auth/forgot-password` - Password reset request

#### Attendance
- `POST /attendance/log` - Check-in/check-out
- `GET /attendance/today` - Today's status
- `GET /attendance/history` - Historical data

#### Performance
- `GET /performance/summary` - All employees performance
- `GET /performance/:userId` - Individual performance
- `GET /performance/department/:deptId` - Department metrics

#### Payroll
- `POST /payroll/calculate` - Calculate monthly payroll
- `GET /payroll/monthly-summary` - Owner dashboard data
- `GET /payroll/department-comparison` - Cross-department analysis

---

## Frontend Logic

### Implementation Location
`/workspace/frontend/AttendanceButton.jsx`

### Zero-Confusion UX Design

The attendance button uses conditional rendering to eliminate user confusion:

```javascript
// Three-state rendering logic
if (!hasCheckedIn) {
  // Show GREEN "Check-in" button
  return <GreenCheckInButton />;
} else if (hasCheckedIn && !checkOutTime) {
  // Show RED "Check-out" button
  return <RedCheckOutButton />;
} else {
  // Show completion message
  return <AttendanceCompleteMessage />;
}
```

### Dashboard Widgets
Four key metrics displayed prominently:
1. **Sisa Cuti** - Remaining leave balance
2. **Total Izin Bulan Ini** - Leaves taken this month
3. **Total Jam Kerja** - Total working hours
4. **Performa** - Current performance label (color-coded)

### Color Coding
- **Green (#22c55e)**: Check-in action, "Baik" performance
- **Red (#ef4444)**: Check-out action, "Buruk" performance
- **Orange (#f59e0b)**: "Cukup" performance
- **Blue (#3b82f6)**: Leave information

---

## Performance Analysis

### Implementation Location
`/workspace/backend/performanceAnalyzer.js`

### Algorithm Details

#### Performance Labeling Criteria

| Label | Attendance | Late Count |
|-------|-----------|------------|
| **Baik** | > 95% | < 2 times |
| **Cukup** | 80-94% | 3-5 times |
| **Buruk** | < 80% | > 5 times |

#### Weighted Score Calculation (Edge Cases)
For cases that don't fit exact criteria:
```
Score = (Attendance % × 0.7) + (Punctuality Score × 0.3)
Punctuality Score = max(0, 100 - (late_count × 10))

Label thresholds:
- Baik: Score ≥ 85
- Cukup: Score ≥ 60
- Buruk: Score < 60
```

#### Available Implementations
- **JavaScript/Node.js**: For Express.js backends
- **Python**: For Django/Flask/FastAPI backends

---

## Email Workflow

### Documentation Location
`/workspace/docs/email-workflow.md`

### Registration Flow

1. **Employee submits registration form**
   - Account created with `status: 'pending'`
   - Employee cannot login yet

2. **System sends email to HR**
   - Contains employee details
   - Includes activation link
   - HTML template with professional design

3. **HR reviews and activates account**
   - Status changed to `active`
   - System sends confirmation email to employee

4. **Employee receives activation confirmation**
   - Can now login to the system
   - Welcome email with login details

### Email Service Options

#### Option 1: Nodemailer (SMTP)
```bash
npm install nodemailer
```
- Supports Gmail, Outlook, custom SMTP
- Free tier available
- Full control over email templates

#### Option 2: Resend API
```bash
npm install resend
```
- Modern email API
- Better deliverability
- Built-in analytics

### Email Templates Included
- New Registration Notification (to HR)
- Account Activation Confirmation (to Employee)
- Password Reset Request

---

## Payroll Calculation

### Formula
```
Gross Salary = Base Salary + Allowance
Deductions = (Leave Deduction) + (Late Deduction) + (Other Deductions)
Net Salary = Gross Salary - Deductions
```

### Deduction Calculations

#### Leave Deduction
```
Daily Rate = Base Salary / Working Days in Month
Leave Deduction = Approved Unpaid Leave Days × Daily Rate
```

#### Late Deduction
```
Late Rate = Configurable amount per late arrival
Late Deduction = Number of Late Arrivals × Late Rate
```

### Automated Process
1. HR triggers payroll calculation for specific month
2. System fetches attendance data for all employees
3. Calculates deductions based on leaves and late arrivals
4. Generates payroll records
5. Owner can view total expenditure and department comparisons

---

## Security Considerations

### Authentication
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)

### Data Protection
- SQL injection prevention via parameterized queries
- XSS protection through input sanitization
- HTTPS enforcement in production

### Audit Trail
- All critical actions logged in `audit_logs` table
- IP address tracking
- Before/after values for sensitive changes

---

## Deployment Recommendations

### Backend
- Node.js with Express.js or Python with FastAPI
- PostgreSQL or MySQL database
- Redis for session management (optional)

### Frontend
- React.js or Vue.js
- Responsive design for mobile access
- Real-time updates with WebSocket (optional)

### Infrastructure
- Docker containerization
- CI/CD pipeline
- Load balancing for high availability
- Regular database backups

---

## Getting Started

### Prerequisites
- Node.js v16+ or Python 3.9+
- MySQL 8.0+ or PostgreSQL 13+
- npm or pip

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd workspace
```

2. **Set up database**
```bash
mysql -u root -p < database/schema.sql
```

3. **Install backend dependencies**
```bash
cd backend
npm install  # or pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Install frontend dependencies**
```bash
cd frontend
npm install
```

6. **Start development servers**
```bash
# Backend
npm run dev

# Frontend
npm start
```

---

## Support & Documentation

For questions or issues, please refer to:
- Database Schema: `/workspace/database/schema.sql`
- API Documentation: `/workspace/docs/api-endpoints.md`
- Email Workflow: `/workspace/docs/email-workflow.md`
- Frontend Components: `/workspace/frontend/AttendanceButton.jsx`
- Performance Logic: `/workspace/backend/performanceAnalyzer.js`

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**License:** Proprietary

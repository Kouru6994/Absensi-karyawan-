-- Database Schema for Integrated HR Management System
-- Tables: Users, Attendance, Leaves, Payroll

-- Users Table (Stores all user accounts with role-based access)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('employee', 'hr', 'owner') NOT NULL DEFAULT 'employee',
    status ENUM('pending', 'active', 'inactive') NOT NULL DEFAULT 'pending',
    department VARCHAR(50),
    position VARCHAR(50),
    base_salary DECIMAL(10, 2) DEFAULT 0.00,
    allowance DECIMAL(10, 2) DEFAULT 0.00,
    leave_quota INT DEFAULT 12,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- Attendance Table (Tracks daily check-in/check-out)
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status ENUM('present', 'late', 'absent', 'half_day') DEFAULT 'present',
    late_minutes INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_date (date),
    INDEX idx_user_date (user_id, date)
);

-- Leaves Table (Manages employee leave requests)
CREATE TABLE leaves (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    leave_type ENUM('annual', 'sick', 'unpaid', 'maternity', 'other') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_status (user_id, status),
    INDEX idx_dates (start_date, end_date)
);

-- Payroll Table (Monthly salary calculations and payments)
CREATE TABLE payroll (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    base_salary DECIMAL(10, 2) NOT NULL,
    allowance DECIMAL(10, 2) DEFAULT 0.00,
    late_deduction DECIMAL(10, 2) DEFAULT 0.00,
    leave_deduction DECIMAL(10, 2) DEFAULT 0.00,
    other_deductions DECIMAL(10, 2) DEFAULT 0.00,
    gross_salary DECIMAL(10, 2) NOT NULL,
    net_salary DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_month_year (user_id, month, year),
    INDEX idx_month_year (month, year),
    INDEX idx_payment_status (payment_status)
);

-- Performance Summary View (For real-time performance tracking)
CREATE VIEW performance_summary AS
SELECT 
    u.id AS user_id,
    u.employee_id,
    u.full_name,
    u.department,
    COUNT(DISTINCT a.date) AS total_working_days,
    SUM(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END) AS present_days,
    SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS late_count,
    ROUND((SUM(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END) * 100.0 / COUNT(DISTINCT a.date)), 2) AS attendance_percentage,
    (SELECT COUNT(*) FROM leaves l WHERE l.user_id = u.id AND l.status = 'approved' AND MONTH(l.start_date) = MONTH(CURRENT_DATE)) AS approved_leaves_this_month
FROM users u
LEFT JOIN attendance a ON u.id = a.user_id AND MONTH(a.date) = MONTH(CURRENT_DATE) AND YEAR(a.date) = YEAR(CURRENT_DATE)
WHERE u.role = 'employee' AND u.status = 'active'
GROUP BY u.id, u.employee_id, u.full_name, u.department;

-- Audit Log Table (Track system changes)
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

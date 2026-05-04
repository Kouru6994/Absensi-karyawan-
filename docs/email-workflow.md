# Email Workflow Documentation

## Registration & Notification System

### Overview
When a new employee registers, the system automatically sends an email notification to HR for verification. The employee cannot login until HR activates their account.

---

## Implementation with Nodemailer (Node.js)

### 1. Installation
```bash
npm install nodemailer
```

### 2. Email Configuration (.env)
```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Or use service-specific config
EMAIL_SERVICE=gmail

# HR Email for notifications
HR_EMAIL=hr@company.com
HR_NAME=HR Department

# System Email
SYSTEM_EMAIL=noreply@company.com
SYSTEM_NAME=HR Management System
```

### 3. Email Service Module
```javascript
// backend/services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email configuration error:', error);
      } else {
        console.log('Email server is ready to send messages');
      }
    });
  }

  /**
   * Send new registration notification to HR
   */
  async sendNewRegistrationNotification(newEmployee, hrEmail) {
    const mailOptions = {
      from: `"${process.env.SYSTEM_NAME}" <${process.env.SYSTEM_EMAIL}>`,
      to: hrEmail || process.env.HR_EMAIL,
      subject: '🔔 New Employee Registration - Action Required',
      html: this.generateRegistrationEmailTemplate(newEmployee)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Registration notification sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send registration notification:', error);
      throw new Error('Failed to send notification email');
    }
  }

  /**
   * Send account activation confirmation to employee
   */
  async sendAccountActivationConfirmation(employee) {
    const mailOptions = {
      from: `"${process.env.SYSTEM_NAME}" <${process.env.SYSTEM_EMAIL}>`,
      to: employee.email,
      subject: '✅ Your Account Has Been Activated',
      html: this.generateActivationConfirmationTemplate(employee)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Activation confirmation sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send activation confirmation:', error);
      throw new Error('Failed to send confirmation email');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(employee, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"${process.env.SYSTEM_NAME}" <${process.env.SYSTEM_EMAIL}>`,
      to: employee.email,
      subject: '🔐 Password Reset Request',
      html: this.generatePasswordResetTemplate(employee, resetLink)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Generate registration email HTML template
   */
  generateRegistrationEmailTemplate(employee) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .employee-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4f46e5; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #6b7280; }
          .value { color: #111827; }
          .action-button { 
            display: inline-block; 
            background: #4f46e5; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin-top: 20px;
            font-weight: bold;
          }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Employee Registration</h1>
          </div>
          
          <div class="content">
            <p>Dear HR Team,</p>
            
            <p>A new employee has registered in the system. Please review the details below and activate their account.</p>
            
            <div class="employee-info">
              <h3 style="margin-top: 0;">Employee Details</h3>
              <div class="info-row">
                <span class="label">Employee ID:</span>
                <span class="value">${employee.employee_id}</span>
              </div>
              <div class="info-row">
                <span class="label">Full Name:</span>
                <span class="value">${employee.full_name}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${employee.email}</span>
              </div>
              <div class="info-row">
                <span class="label">Department:</span>
                <span class="value">${employee.department || 'Not specified'}</span>
              </div>
              <div class="info-row">
                <span class="label">Position:</span>
                <span class="value">${employee.position || 'Not specified'}</span>
              </div>
              <div class="info-row">
                <span class="label">Registration Date:</span>
                <span class="value">${new Date().toLocaleDateString()}</span>
              </div>
              <div class="info-row">
                <span class="label">Status:</span>
                <span class="value" style="color: #f59e0b; font-weight: bold;">⏳ Pending Approval</span>
              </div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Action Required:</strong> This employee cannot login until you activate their account.
            </div>
            
            <a href="${process.env.ADMIN_URL}/users/pending" class="action-button">
              Review & Activate Account
            </a>
          </div>
          
          <div class="footer">
            <p>This is an automated message from HR Management System</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate activation confirmation email template
   */
  generateActivationConfirmationTemplate(employee) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .success-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .login-button { 
            display: inline-block; 
            background: #10b981; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin-top: 20px;
            font-weight: bold;
          }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Account Activated!</h1>
          </div>
          
          <div class="content">
            <p>Dear ${employee.full_name},</p>
            
            <div class="success-box">
              <h2 style="margin: 0; color: #065f46;">🎉 Welcome Aboard!</h2>
              <p style="margin: 10px 0 0 0; color: #047857;">Your account has been activated successfully.</p>
            </div>
            
            <p>You can now access the HR Management System using your credentials.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your Login Details:</strong></p>
              <p>Email: <strong>${employee.email}</strong></p>
              <p>Employee ID: <strong>${employee.employee_id}</strong></p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" class="login-button">
                Login to System
              </a>
            </div>
            
            <p style="margin-top: 20px;">If you have any questions, please contact the HR department.</p>
          </div>
          
          <div class="footer">
            <p>HR Management System</p>
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate password reset email template
   */
  generatePasswordResetTemplate(employee, resetLink) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6366f1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .reset-button { 
            display: inline-block; 
            background: #6366f1; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin-top: 20px;
            font-weight: bold;
          }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          
          <div class="content">
            <p>Dear ${employee.full_name},</p>
            
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="reset-button">
                Reset Password
              </a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </div>
            
            <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6366f1;">${resetLink}</p>
          </div>
          
          <div class="footer">
            <p>HR Management System</p>
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
```

---

## Integration with Registration Controller

```javascript
// backend/controllers/authController.js
const emailService = require('../services/emailService');
const User = require('../models/User');

class AuthController {
  /**
   * Handle new employee registration
   */
  async signup(req, res) {
    try {
      const { employee_id, full_name, email, password, department, position } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { employee_id }] 
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or employee ID already exists'
        });
      }

      // Create new user with pending status
      const newUser = await User.create({
        employee_id,
        full_name,
        email,
        password_hash: await hashPassword(password),
        department,
        position,
        role: 'employee',
        status: 'pending' // Default to pending
      });

      // Send notification to HR
      try {
        await emailService.sendNewRegistrationNotification({
          employee_id,
          full_name,
          email,
          department,
          position
        });

        console.log(`Notification sent to HR for new registration: ${email}`);
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the registration if email fails, just log it
      }

      res.status(201).json({
        success: true,
        message: 'Registration successful. Your account is pending HR approval.',
        data: {
          employee_id,
          full_name,
          email,
          status: 'pending'
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  /**
   * Activate user account (HR only)
   */
  async activateUser(req, res) {
    try {
      const { userId } = req.params;
      const { activatedBy } = req.user; // From JWT token

      const user = await User.findByIdAndUpdate(
        userId,
        { status: 'active' },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Send activation confirmation to employee
      try {
        await emailService.sendAccountActivationConfirmation(user);
        console.log(`Activation confirmation sent to: ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send activation confirmation:', emailError);
      }

      res.status(200).json({
        success: true,
        message: 'User account activated successfully',
        data: user
      });
    } catch (error) {
      console.error('Activation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to activate user',
        error: error.message
      });
    }
  }

  /**
   * Login - Check if account is active
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is active
      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Your account is not active. Please wait for HR approval.',
          status: user.status
        });
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = generateJWTToken(user);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            employee_id: user.employee_id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            department: user.department
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();
```

---

## Alternative: Using Resend API

### 1. Installation
```bash
npm install resend
```

### 2. Configuration
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Resend Implementation
```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendRegistrationNotification(employee) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'HR System <onboarding@yourdomain.com>',
      to: 'hr@company.com',
      subject: 'New Employee Registration',
      html: generateRegistrationEmailTemplate(employee)
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
```

---

## Testing Email Configuration

```javascript
// Test endpoint for email configuration
app.post('/api/notifications/email-test', async (req, res) => {
  try {
    await emailService.sendNewRegistrationNotification({
      employee_id: 'TEST001',
      full_name: 'Test Employee',
      email: 'test@example.com',
      department: 'Testing',
      position: 'Test Role'
    });

    res.json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});
```

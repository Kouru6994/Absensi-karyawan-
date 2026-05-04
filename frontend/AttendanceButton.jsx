import React, { useState, useEffect } from 'react';
import axios from 'axios';

// AttendanceButton Component - Zero-Confusion UX
const AttendanceButton = () => {
  const [attendanceStatus, setAttendanceStatus] = useState({
    hasCheckedIn: false,
    checkInTime: null,
    checkOutTime: null,
    status: 'not_checked_in'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch today's attendance status on component mount
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const response = await axios.get('/api/attendance/today');
      setAttendanceStatus(response.data);
    } catch (err) {
      console.error('Failed to fetch attendance status:', err);
    }
  };

  const handleAttendanceClick = async (type) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/attendance/log', {
        type: type, // 'check_in' or 'check_out'
        timestamp: new Date().toISOString()
      });

      // Update local state based on action
      if (type === 'check_in') {
        setAttendanceStatus({
          ...attendanceStatus,
          hasCheckedIn: true,
          checkInTime: new Date().toLocaleTimeString(),
          status: 'present'
        });
      } else {
        setAttendanceStatus({
          ...attendanceStatus,
          checkOutTime: new Date().toLocaleTimeString()
        });
      }

      // Show success notification
      showNotification(
        'Success',
        type === 'check_in' ? 'Check-in successful!' : 'Check-out successful!',
        'success'
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log attendance');
      showNotification(
        'Error',
        err.response?.data?.message || 'Failed to log attendance',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (title, message, type) => {
    // Implement your notification system here
    console.log(`[${type}] ${title}: ${message}`);
  };

  // Conditional Rendering Logic - Zero-Confusion UX
  const renderButton = () => {
    // Case 1: User has not checked in yet
    if (!attendanceStatus.hasCheckedIn) {
      return (
        <button
          onClick={() => handleAttendanceClick('check_in')}
          disabled={loading}
          className="attendance-btn check-in-btn"
          style={{
            backgroundColor: '#22c55e', // Green color
            color: 'white',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <>
              <Spinner />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Icon name="clock-in" />
              <span>Check-in</span>
            </>
          )}
        </button>
      );
    }

    // Case 2: User has checked in but not checked out yet
    if (attendanceStatus.hasCheckedIn && !attendanceStatus.checkOutTime) {
      return (
        <button
          onClick={() => handleAttendanceClick('check_out')}
          disabled={loading}
          className="attendance-btn check-out-btn"
          style={{
            backgroundColor: '#ef4444', // Red color
            color: 'white',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <>
              <Spinner />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Icon name="clock-out" />
              <span>Check-out</span>
            </>
          )}
        </button>
      );
    }

    // Case 3: User has already checked in and checked out
    return (
      <div
        className="attendance-complete"
        style={{
          padding: '20px',
          backgroundColor: '#f0fdf4',
          border: '2px solid #22c55e',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '16px' }}>
          ✓ Attendance Completed for Today
        </p>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
          Check-in: {attendanceStatus.checkInTime} | Check-out: {attendanceStatus.checkOutTime}
        </p>
      </div>
    );
  };

  return (
    <div className="attendance-widget">
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>Today's Attendance</h2>
      {renderButton()}
      {error && (
        <p style={{ color: '#ef4444', marginTop: '10px' }}>{error}</p>
      )}
    </div>
  );
};

// Dashboard Widgets Component
const EmployeeDashboardWidgets = () => {
  const [dashboardData, setDashboardData] = useState({
    remainingLeave: 0,
    totalLeavesThisMonth: 0,
    totalWorkingHours: 0,
    performanceLabel: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/employee');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-widgets" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
      {/* Widget 1: Remaining Leave */}
      <div
        className="widget"
        style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>Sisa Cuti</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
          {dashboardData.remainingLeave}
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>days remaining</p>
      </div>

      {/* Widget 2: Total Leaves This Month */}
      <div
        className="widget"
        style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>Total Izin Bulan Ini</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
          {dashboardData.totalLeavesThisMonth}
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>days taken</p>
      </div>

      {/* Widget 3: Total Working Hours */}
      <div
        className="widget"
        style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>Total Jam Kerja</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
          {dashboardData.totalWorkingHours}
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>hours this month</p>
      </div>

      {/* Widget 4: Performance Label */}
      <div
        className="widget"
        style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>Performa</h3>
        <p
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: getPerformanceColor(dashboardData.performanceLabel)
          }}
        >
          {dashboardData.performanceLabel}
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>current month</p>
      </div>
    </div>
  );
};

// Helper function to get performance label color
const getPerformanceColor = (label) => {
  switch (label) {
    case 'Baik':
      return '#22c55e'; // Green
    case 'Cukup':
      return '#f59e0b'; // Orange
    case 'Buruk':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
};

// Placeholder components for icons and spinner
const Icon = ({ name }) => <span>🕐</span>;
const Spinner = () => <span>⏳</span>;

// Main Dashboard Component
const EmployeeDashboard = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#111827' }}>
        Employee Dashboard
      </h1>
      <AttendanceButton />
      <EmployeeDashboardWidgets />
    </div>
  );
};

export default EmployeeDashboard;

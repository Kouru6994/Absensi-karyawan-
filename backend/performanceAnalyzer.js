/**
 * Performance Analysis Module
 * Calculates employee performance labels based on attendance data
 * 
 * Criteria:
 * - Baik: Kehadiran > 95% & Terlambat < 2 kali
 * - Cukup: Kehadiran 80-94% & Terlambat 3-5 kali
 * - Buruk: Kehadiran < 80% atau Terlambat > 5 kali
 */

// JavaScript/Node.js Implementation
class PerformanceAnalyzer {
  constructor() {
    this.thresholds = {
      excellent: { minAttendance: 95, maxLate: 1 },
      good: { minAttendance: 80, maxAttendance: 94, minLate: 3, maxLate: 5 },
      poor: { maxAttendance: 79, minLate: 6 }
    };
  }

  /**
   * Calculate performance label for a single employee
   * @param {Object} attendanceData - Employee attendance data
   * @returns {Object} Performance analysis result
   */
  calculatePerformanceLabel(attendanceData) {
    const {
      totalWorkingDays,
      presentDays,
      lateCount,
      employeeId,
      employeeName,
      department
    } = attendanceData;

    // Calculate attendance percentage
    const attendancePercentage = totalWorkingDays > 0
      ? Math.round((presentDays / totalWorkingDays) * 100 * 100) / 100
      : 0;

    // Determine performance label based on criteria
    let performanceLabel;
    let performanceScore;

    if (attendancePercentage > 95 && lateCount < 2) {
      performanceLabel = 'Baik';
      performanceScore = 100;
    } else if (
      (attendancePercentage >= 80 && attendancePercentage <= 94) &&
      (lateCount >= 3 && lateCount <= 5)
    ) {
      performanceLabel = 'Cukup';
      performanceScore = 70;
    } else if (attendancePercentage < 80 || lateCount > 5) {
      performanceLabel = 'Buruk';
      performanceScore = 40;
    } else {
      // Edge cases - calculate weighted score
      performanceScore = this.calculateWeightedScore(attendancePercentage, lateCount);
      performanceLabel = this.getLabelFromScore(performanceScore);
    }

    return {
      employeeId,
      employeeName,
      department,
      attendancePercentage,
      lateCount,
      presentDays,
      totalWorkingDays,
      performanceLabel,
      performanceScore,
      analyzedAt: new Date().toISOString()
    };
  }

  /**
   * Calculate weighted performance score for edge cases
   * @param {number} attendancePercentage
   * @param {number} lateCount
   * @returns {number} Performance score (0-100)
   */
  calculateWeightedScore(attendancePercentage, lateCount) {
    // Weight: 70% attendance, 30% punctuality
    const attendanceWeight = 0.7;
    const punctualityWeight = 0.3;

    // Normalize punctuality score (assuming max 10 lates as worst case)
    const punctualityScore = Math.max(0, 100 - (lateCount * 10));

    const weightedScore = (attendancePercentage * attendanceWeight) +
                         (punctualityScore * punctualityWeight);

    return Math.round(weightedScore * 100) / 100;
  }

  /**
   * Get performance label from score
   * @param {number} score
   * @returns {string} Performance label
   */
  getLabelFromScore(score) {
    if (score >= 85) return 'Baik';
    if (score >= 60) return 'Cukup';
    return 'Buruk';
  }

  /**
   * Analyze performance for multiple employees
   * @param {Array} employeesData - Array of employee attendance data
   * @returns {Array} Performance analysis results
   */
  analyzeBulkPerformance(employeesData) {
    return employeesData.map(data => this.calculatePerformanceLabel(data));
  }

  /**
   * Get performance statistics by department
   * @param {Array} performanceResults - Array of performance analysis results
   * @returns {Object} Department-wise statistics
   */
  getDepartmentStatistics(performanceResults) {
    const departmentStats = {};

    performanceResults.forEach(result => {
      const dept = result.department || 'Unassigned';

      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          totalEmployees: 0,
          baikCount: 0,
          cukupCount: 0,
      burukCount: 0,
          avgAttendance: 0,
          avgLateCount: 0,
          employees: []
        };
      }

      const stats = departmentStats[dept];
      stats.totalEmployees++;
      stats.employees.push(result);

      if (result.performanceLabel === 'Baik') stats.baikCount++;
      else if (result.performanceLabel === 'Cukup') stats.cukupCount++;
      else stats.burukCount++;

      stats.avgAttendance += result.attendancePercentage;
      stats.avgLateCount += result.lateCount;
    });

    // Calculate averages
    Object.keys(departmentStats).forEach(dept => {
      const stats = departmentStats[dept];
      stats.avgAttendance = Math.round(
        (stats.avgAttendance / stats.totalEmployees) * 100
      ) / 100;
      stats.avgLateCount = Math.round(
        (stats.avgLateCount / stats.totalEmployees) * 100
      ) / 100;

      // Calculate percentages
      stats.baikPercentage = Math.round(
        (stats.baikCount / stats.totalEmployees) * 100 * 100
      ) / 100;
      stats.cukupPercentage = Math.round(
        (stats.cukupCount / stats.totalEmployees) * 100 * 100
      ) / 100;
      stats.burukPercentage = Math.round(
        (stats.burukCount / stats.totalEmployees) * 100 * 100
      ) / 100;
    });

    return departmentStats;
  }
}

// Python Implementation (for backend services)
class PerformanceAnalyzerPython:
    """
    Python implementation of Performance Analyzer
    Can be used in Django/Flask/FastAPI backends
    """
    
    def __init__(self):
        self.thresholds = {
            'excellent': {'min_attendance': 95, 'max_late': 1},
            'good': {'min_attendance': 80, 'max_attendance': 94, 'min_late': 3, 'max_late': 5},
            'poor': {'max_attendance': 79, 'min_late': 6}
        }
    
    def calculate_performance_label(self, attendance_data):
        """
        Calculate performance label for a single employee
        
        Args:
            attendance_data (dict): Employee attendance data
            
        Returns:
            dict: Performance analysis result
        """
        total_working_days = attendance_data.get('total_working_days', 0)
        present_days = attendance_data.get('present_days', 0)
        late_count = attendance_data.get('late_count', 0)
        employee_id = attendance_data.get('employee_id')
        employee_name = attendance_data.get('employee_name')
        department = attendance_data.get('department')
        
        # Calculate attendance percentage
        if total_working_days > 0:
            attendance_percentage = round((present_days / total_working_days) * 100, 2)
        else:
            attendance_percentage = 0
        
        # Determine performance label
        if attendance_percentage > 95 and late_count < 2:
            performance_label = 'Baik'
            performance_score = 100
        elif (80 <= attendance_percentage <= 94) and (3 <= late_count <= 5):
            performance_label = 'Cukup'
            performance_score = 70
        elif attendance_percentage < 80 or late_count > 5:
            performance_label = 'Buruk'
            performance_score = 40
        else:
            # Edge cases - calculate weighted score
            performance_score = self._calculate_weighted_score(
                attendance_percentage, late_count
            )
            performance_label = self._get_label_from_score(performance_score)
        
        return {
            'employee_id': employee_id,
            'employee_name': employee_name,
            'department': department,
            'attendance_percentage': attendance_percentage,
            'late_count': late_count,
            'present_days': present_days,
            'total_working_days': total_working_days,
            'performance_label': performance_label,
            'performance_score': performance_score,
            'analyzed_at': datetime.now().isoformat()
        }
    
    def _calculate_weighted_score(self, attendance_percentage, late_count):
        """Calculate weighted performance score for edge cases"""
        attendance_weight = 0.7
        punctuality_weight = 0.3
        
        punctuality_score = max(0, 100 - (late_count * 10))
        
        weighted_score = (attendance_percentage * attendance_weight) + \
                        (punctuality_score * punctuality_weight)
        
        return round(weighted_score, 2)
    
    def _get_label_from_score(self, score):
        """Get performance label from score"""
        if score >= 85:
            return 'Baik'
        elif score >= 60:
            return 'Cukup'
        return 'Buruk'
    
    def analyze_bulk_performance(self, employees_data):
        """Analyze performance for multiple employees"""
        return [self.calculate_performance_label(data) for data in employees_data]
    
    def get_department_statistics(self, performance_results):
        """Get performance statistics by department"""
        from collections import defaultdict
        
        department_stats = defaultdict(lambda: {
            'total_employees': 0,
            'baik_count': 0,
            'cukup_count': 0,
            'buruk_count': 0,
            'avg_attendance': 0,
            'avg_late_count': 0,
            'employees': []
        })
        
        for result in performance_results:
            dept = result.get('department') or 'Unassigned'
            stats = department_stats[dept]
            
            stats['total_employees'] += 1
            stats['employees'].append(result)
            
            if result['performance_label'] == 'Baik':
                stats['baik_count'] += 1
            elif result['performance_label'] == 'Cukup':
                stats['cukup_count'] += 1
            else:
                stats['buruk_count'] += 1
            
            stats['avg_attendance'] += result['attendance_percentage']
            stats['avg_late_count'] += result['late_count']
        
        # Calculate averages and percentages
        for dept, stats in department_stats.items():
            stats['avg_attendance'] = round(
                stats['avg_attendance'] / stats['total_employees'], 2
            )
            stats['avg_late_count'] = round(
                stats['avg_late_count'] / stats['total_employees'], 2
            )
            stats['baik_percentage'] = round(
                (stats['baik_count'] / stats['total_employees']) * 100, 2
            )
            stats['cukup_percentage'] = round(
                (stats['cukup_count'] / stats['total_employees']) * 100, 2
            )
            stats['buruk_percentage'] = round(
                (stats['buruk_count'] / stats['total_employees']) * 100, 2
            )
        
        return dict(department_stats)


# Example Usage
if __name__ == '__main__':
    # JavaScript Example
    const analyzer = new PerformanceAnalyzer();
    
    const sampleData = [
      {
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        department: 'Engineering',
        totalWorkingDays: 22,
        presentDays: 22,
        lateCount: 1
      },
      {
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        department: 'Marketing',
        totalWorkingDays: 22,
        presentDays: 18,
        lateCount: 4
      },
      {
        employeeId: 'EMP003',
        employeeName: 'Bob Wilson',
        department: 'Sales',
        totalWorkingDays: 22,
        presentDays: 16,
        lateCount: 7
      }
    ];
    
    const results = analyzer.analyzeBulkPerformance(sampleData);
    console.log('Performance Results:', results);
    
    const deptStats = analyzer.getDepartmentStatistics(results);
    console.log('Department Statistics:', deptStats);

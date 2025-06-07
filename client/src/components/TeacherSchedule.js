import React, { useEffect, useState } from 'react';
import { Read } from '../fetch';

export default function TeacherSchedule({ empId }) {
  const [scheduleList, setScheduleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await Read(`/schedules/teacher/${empId}`);
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setScheduleList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (empId) fetchSchedule();
  }, [empId]);

  if (loading) return <p>טוען מערכת שעות...</p>;
  if (error) return <p style={{ color: 'red' }}>שגיאה בטעינה: {error}</p>;
  if (scheduleList.length === 0) return <p>אין פריטים להצגה.</p>;

  const tableStyle = { width: '100%', borderCollapse: 'collapse' };
  const cellStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };

  return (
    <table style={tableStyle}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={cellStyle}>יום</th>
          <th style={cellStyle}>שעת התחלה</th>
          <th style={cellStyle}>שעת סיום</th>
          <th style={cellStyle}>קורס</th>
        </tr>
      </thead>
      <tbody>
        {scheduleList.map((item, index) => (
          <tr
            key={index}
            style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }}
          >
            <td style={cellStyle}>{item.Day}</td>
            <td style={cellStyle}>{item.BeginningTime}</td>
            <td style={cellStyle}>{item.EndTime}</td>
            <td style={cellStyle}>{item.CourseName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

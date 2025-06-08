// import React, { useEffect, useState } from 'react';
// import { Read } from '../fetch';

import { useEffect, useState } from "react";
import { Read } from "../fetch";

export default function TeacherSchedule({ empId }) {
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleList, setScheduleList] = useState([]);
  useEffect(() => {
    async function fetchSchedule() {
      try {
        console.log("Fetching schedule for empId:", empId);
        
        const response = await Read(`/schedules/teacher/${empId}`);
        // if (!response.ok)
        //   throw new Error(`Error: ${response.status} ${response.statusText}`);
        console.log("Response status:", response);
        
        
        setScheduleList(response);
        // setLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        // setLoading(false);
      }
    }
   fetchSchedule();
  }, [empId]);

  // if (loading) return <p>טוען מערכת שעות...</p>;
  // if (error) return <p style={{ color: "red" }}>שגיאה בטעינה: {error}</p>;
  // if (!scheduleList || scheduleList.length === 0) {
  //   return <p>אין מערכת שעות להצגה.</p>;
  // }

  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];
  const units = Array.from(new Set(scheduleList.map((e) => e.UnitId))).sort(
    (a, b) => a - b
  );

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    direction: "rtl",
    textAlign: "center",
  };
  const headerStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f2f2f2",
  };
  const cellStyle = { border: "1px solid #ddd", padding: "8px" };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerStyle}>יחידה / יום</th>
          {days.map((day) => (
            <th key={day} style={headerStyle}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {units.map((unit) => (
          <tr
            key={unit}
            style={{ backgroundColor: unit % 2 === 0 ? "#ffffff" : "#fafafa" }}
          >
            <td style={cellStyle}>יחידה {unit}</td>
            {days.map((day) => {
              const lessons = scheduleList.filter(
                (entry) => entry.UnitId === unit && entry.Day === day
              );
              if (lessons.length > 0) {
                return (
                  <td key={day} style={cellStyle}>
                    {lessons.map((lesson, idx) => (
                      <div key={idx} style={{ marginBottom: "8px" }}>
                        <div>
                          {lesson.BeginningTime} - {lesson.EndTime}
                        </div>
                        <div>{lesson.CourseName}</div>
                        <div>
                          {lesson.MegamaName} - שנה {lesson.YearLetter}
                        </div>
                      </div>
                    ))}
                  </td>
                );
              }
              return (
                <td key={day} style={cellStyle}>
                  —
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

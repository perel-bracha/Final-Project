import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Insert, Read } from "../fetch"; // ניתן לשנות כדי להתאים למנהל המידע שלך
import { CourseForTeam } from "../objects/courseForTeamObj";
import { Course } from "../objects/courseObj"; // ניתן לשנות כדי להתאים למנהל המידע שלך

export default function AddCourse() {
  const location = useLocation();
  const team = location.state ? location.state.team : "";
  const spe = location.state ? location.state.spe : "";

  const [employees, setEmployees] = useState([]);
  const [firstReadEmps, setFirstReadEmps] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [courseData, setCourseData] = useState({
    CourseName: "", //c
    CourseId: 0, //cft
    HoursPerYear: "", //c
    Semester: "", //cft
    EmployeeId: "", //cft
    Year: "", // מה עושים עם השנה?
  });

  useEffect(() => {
    if (firstReadEmps) {
      readEmployees();
    }
  }, [firstReadEmps]); // useEffect יקרא ל- readEmployees פעם אחת בהתחלה, כאשר firstReadEmps משתנה

  const readEmployees = async () => {
    try {
      const res = await Read(`/employees`); ///?speName='${spe.SpeName}'
      console.log(res);
      setEmployees(res);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      // שליחת הבקשה לשרת להוספת הקורס
      const exist = await Read(
        `/courses/?courseName="${courseData.CourseName}"`
      );
      if (exist.length === 0) {
        let newCourse = new Course(
          0,
          courseData.CourseName,
          courseData.HoursPerYear
        );
        await Insert("/courses", { newCourse: newCourse });
        const added = await Read(
          `/courses/?courseName=${courseData.CourseName}`
        );
        if (added.length === 1) {
          console.log(added);
          //מי הקבוצה שלי?
          let newCFT = new CourseForTeam(
            0,
            added[0].CourseId,
            team.TeamId,
            courseData.Semester,
            courseData.EmployeeId
          );
          await Insert("/courseForTeam", {newCFT:newCFT});
        }
        alert("הקורס נוסף בהצלחה");
      } else {
        alert("הקורס כבר קיים ");
      }
      // איפוס הטופס לאחר שהנתונים נשלחו בהצלחה
      setCourseData({
        CourseName: "",
        CourseId: 0,
        HoursPerYear: "",
        Semester: "",
        EmployeeId: "",
        Year: "",
      });
    } catch (error) {
      console.error("Error adding course:", error);
    } finally {
      setSubmitting(false);
    }
  };
  console.log(employees);

  return (
    <div className="addCourse">
      <h2>הוספת קורס חדש</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם הקורס:</label>
          <input
            type="text"
            value={courseData.CourseName}
            onChange={(e) =>
              setCourseData({ ...courseData, CourseName: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>שם מגמה:</label>
          <input type="text" value={spe.SpeName} readOnly />
        </div>

        <div>
          <label>שנה:</label>
          <select
            value={courseData.Year}
            onChange={(e) => setCourseData(e.target.value)}
            required
          >
            {/* <option value="">בחר שנה...</option> */}
            <option value="א'">א'</option>
            <option value="ב'">ב'</option>
            <option value="ג'">ג'</option>
          </select>
        </div>

        <div>
          <label>מספר שעות שנתיות:</label>
          <input
            type="text"
            value={courseData.HoursPerYear}
            onChange={(e) =>
              setCourseData({ ...courseData, HoursPerYear: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>סמסטר:</label>
          <select
            value={courseData.Semester}
            onChange={(e) =>
              setCourseData({ ...courseData, Semester: e.target.value })
            }
            required
          >
            {/* <option value="">בחר סמסטר...</option> */}
            <option value={"א"}>א'</option>
            <option value={"ב"}>ב'</option>
            <option value={"שנתי"}>שנתי</option>
          </select>
        </div>

        <div>
          <label>קוד עובד:</label>
          <select
            value={courseData.EmployeeId}
            onChange={(e) =>
              setCourseData({ ...courseData, EmployeeId: e.target.value })
            }
            required
          >
            {/* <option value="">בחר עובד...</option> */}
            {employees.map((emp, index) => (
              <option
                key={index}
                value={emp.EmployeeId}
              >{`${emp.FirstName} ${emp.LastName}`}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={submitting}>
          הוסף קורס
        </button>
      </form>
    </div>
  );
}

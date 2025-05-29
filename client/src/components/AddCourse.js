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
    Semester: "א", //cft
    EmpId: "", //cft
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
        //רק אם הקורס לא קיים אז הא מוסיף אותו
        console.log("courseData", courseData);
        let newCourse = new Course(
          0,
          courseData.CourseName,
          courseData.HoursPerYear
        );

        await Insert("/courses", { newCourse: newCourse });
        exist = await Read(`/courses/?courseName=${courseData.CourseName}`);
      }

      console.log("exist: ", exist);

      //מי הקבוצה שלי?
      let newCFT = new CourseForTeam(
        0,
        exist[0].CourseId,
        team.TeamId,
        courseData.Semester,
        courseData.EmpId,

      );

      console.log("newCFT:", newCFT);

      await Insert("/courseForTeam", { newCFT: newCFT });
      // איפוס הטופס לאחר שהנתונים נשלחו בהצלחה
      setCourseData({
        CourseName: "",
        CourseId: 0,
        HoursPerYear: "",
        Semester: "",
        EmpId: "",
        Year: "",
      });
      alert("הקורס נוסף בהצלחה");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("שגיאה בהוספת הקורס. אנא נסה שוב.");
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
            onChange={(e) => {
              setCourseData({ ...courseData, Year: e.target.value });
              console.log("courseData", courseData);
            }}
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
          <label>מורה:</label>
          <select
            value={courseData.EmpId}
            onChange={(e) =>
              setCourseData({ ...courseData, EmpId: e.target.value })
            }
            required
          >
            {/* <option value="">בחר עובד...</option> */}
            {employees.map((emp) => (
              <option
                key={emp.EmpId}
                value={emp.EmpId} // הערך שיישמר`
              >
                {`${emp.FirstName} ${emp.LastName}`}
              </option>
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

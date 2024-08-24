import React, { useEffect, useState } from "react";
import "./styles/style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Read } from "../fetch";
import { Specialization } from "../objects/specializationObj";
import { Employee } from "../objects/employeeObj";

export default function Home({ spe, emp }) {
  const navigate = useNavigate();
  // const spe = location.state ? location.state.spe : new Specialization(); // אם location.state אינו מוגדר, הצב ערך ברירת מחדל
  // const emp = location.state ? location.state.emp : new Employee(); // אם location.state אינו מוגדר, הצב ערך ברירת מחדל

  console.log(spe);

  console.log(emp);
  const [currentSpe, setCurrentSpe] = useState(spe);
  const [currentEmp, setCurrentEmp] = useState(emp);
  const [teams, setTeams] = useState([]);
  const [teamIndex, setTeamIndex] = useState(0);
  const [unitTimes, setUnitTimes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];

  useEffect(() => {
    // Fetch teams based on currentSpe
    Read(`/teams/?speName='${currentSpe.SpeName}'`)
      .then((dataTeams) => {
        // console.log(dataTeams);
        setTeamIndex(0);
        setTeams(dataTeams);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, [currentSpe]);

  useEffect(() => {
    if (teams.length > 0) {
      // Fetch courses based on currentSpe and the selected team
      Read(
        `/courseForTeam/?speName='${currentSpe.SpeName}'&startingStudiesYear=${teams[teamIndex].StartingStudiesYear}&semester='א'`
      )
        .then((data) => {
          const coursesArray = data.map((course) =>
            course.CourseName.toString()
          );
          setCourses(coursesArray);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        });
    }
  }, [currentSpe, teamIndex, teams]);

  useEffect(() => {
    Read("/units")
      .then((data) => {
        const timesArray = data.map((unit) => ({
          BeginningTime: unit.BeginningTime.substring(0, 5),
          EndTime: unit.EndTime.substring(0, 5),
        }));
        setUnitTimes(timesArray);
      })
      .catch((error) => {
        console.error("Error fetching unit times:", error);
      });
  }, []);

  useEffect(() => {
    if (teams && teams.length > 0) {
      console.log(teams, teamIndex, teams[teamIndex].TeamId);

      Read(`/schedules/?teamId=${teams[teamIndex].TeamId}`)
        .then((data) => {
          console.log(data);

          setSchedules(data);
          console.log(schedules);
        })
        .catch((error) => {
          console.error("Error fetching schedules:", error);
        });
    }
  }, [teams]);
  // const courses = ["מתמטיקה", "אנגלית", "מדעים", "היסטוריה"];

  const rooms = ["חדר 101", "חדר 102", "חדר 103", "חדר 104"];

  return (
    <div className="home">
      <h1>
        {" "}
        {currentSpe.SpeName}
        {/* צריך לבדוק שהindex באמת תואם לקבוצה */}
        {teams.map((team, index) => {
          return (
            <button key={index} onClick={() => setTeamIndex(index)}>
              {team.StartingStudiesYear}
            </button>
          );
        })}
      </h1>
      <table>
        <thead>
          <tr>
            <th> </th>
            {daysOfWeek.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {unitTimes.map((hour, rowIndex) => (
            <tr key={rowIndex}>
              <td>{`${hour.BeginningTime} - ${hour.EndTime}`}</td>
              {daysOfWeek.map((day, colIndex) => (
                <td key={colIndex}>
                  <input type="time" defaultValue={hour.BeginningTime} />
                  <input type="time" defaultValue={hour.EndTime} />
                  <select>
                    <option value="" disabled selected>
                      בחר קורס
                    </option>
                    {courses.map((course, courseIndex) => (
                      <option key={courseIndex} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                  <select>
                    <option value="" disabled selected>
                      בחר חדר
                    </option>
                    {rooms.map((room, roomIndex) => (
                      <option key={roomIndex} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSchedule(colIndex + 1, rowIndex)}
                  >
                    שבץ
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          navigate("addSpe", {
            state: { speObj: currentSpe, addUpdateStatus: "עדכון" },
          });
        }}
      >
        עדכון מגמה נוכחית
      </button>
      <button
        onClick={() => {
          navigate("addSpe", {
            state: { speObj: new Specialization(), addUpdateStatus: "הוספה" },
          });
        }}
      >
        הוספת מגמה
      </button>
      {/*       
      <Link to="addTeam">
        <button> הוספת קבוצה</button>
      </Link>
      <Link to="addTeacher">
        <button>הוספת מורה</button>
      </Link> */}

      <button
        onClick={() => {
          navigate(`addTeam`);
        }}
      >
        הוספת קבוצה
      </button>

      <button
        onClick={() => {
          navigate(`addTeacher`);
        }}
      >
        הוספת מורה
      </button>

      <button
        // אני צריכה לשלוח את שנת ההתחלה של הקבוצה על מנת להוסיף קורס חדש
        onClick={() => {
          navigate("addCourse", {
            state: { team: teams[teamIndex], spe: currentSpe },
          });
        }}
      >
        הוספת קורס
      </button>
      <Link to="/">
        <button>רשימת מורות</button>
      </Link>
      <Link to="/">
        <button>רשימת קורסים</button>
      </Link>
    </div>
  );
}

const handleSchedule = (day, unit) => {
  console.log(`day: ${day}, unit: ${unit}`);
};

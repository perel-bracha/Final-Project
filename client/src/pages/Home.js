import React, { useEffect, useState } from "react";
import "./styles/style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Insert, Read, Update } from "../fetch";
import { Specialization } from "../objects/specializationObj";
import { Employee } from "../objects/employeeObj";
import { Schedule } from "../objects/scheduleObj";

export default function Home({ spe, emp }) {
  const navigate = useNavigate();
  // const spe = location.state ? location.state.spe : new Specialization(); // אם location.state אינו מוגדר, הצב ערך ברירת מחדל
  // const emp = location.state ? location.state.emp : new Employee(); // אם location.state אינו מוגדר, הצב ערך ברירת מחדל
  // console.log(spe);
  const [currentSpe, setCurrentSpe] = useState(spe);

  const [teams, setTeams] = useState([]);
  const [teamIndex, setTeamIndex] = useState(0);
  const [unitTimes, setUnitTimes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedulesList, setSchedulesList] = useState([]);
  const [schedules, setSchedules] = useState([[]]);
  const dayMapping = {
    ראשון: 1,
    שני: 2,
    שלישי: 3,
    רביעי: 4,
    חמישי: 5,
  };
  const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

  const updateSchedule = (day, unit, field, value) => {
    const updatedSchedules = schedules.map((row, rowIndex) =>
      row.map((schedule, colIndex) => {
        if (rowIndex === day && colIndex === unit) {
          return { ...schedule, [field]: value };
        }
        return schedule;
      })
    );
    setSchedules(updatedSchedules);
    console.log(updatedSchedules);
  };

  const handleSchedule = (day, unit) => {
    // console.log(`day: ${day}, unit: ${unit}`);
    if (!schedules[day][unit].CTId)
      alert("יש לבחור קורס לשיבוץ"); //בדיקת התעדכנות עם קורסים מרובים
    else {
      const newSchedule = schedules[day][unit];
      newSchedule.UnitId = unit;
      newSchedule.Day = daysOfWeek[day];
      newSchedule.BeginningTime =
        schedules[day][unit].BeginningTime || unitTimes[unit].BeginningTime;
      newSchedule.EndTime =
        schedules[day][unit].EndTime || unitTimes[unit].EndTime;

      if (newSchedule.SchedId == "") {
        /// כפילותתפיסת שגיאת שיבוץץ
        console.log("newSchedule:",newSchedule);
        
        Insert(`/schedules`, { newSchedule: newSchedule })
          .then((data) => {
            newSchedule.SchedId = data;
            setSchedules((prevSchedules) => {
              const updatedSchedules = [...prevSchedules];
              updatedSchedules[day][unit] = newSchedule;
              return updatedSchedules;
            });
            console.log("Schedule inserted successfully:", data);
          })
          .catch((error) => {
            console.error("Failed to insert schedule:", error);
            const errorMessage =
              error.response?.data?.error ||
              error.message ||
              "An unexpected error occurred";
            alert(errorMessage);
          });
      } else {
        if (window.confirm("האם אתה בטוח שברצונך לשנות את השיבוץ?")) {
          Update(`/schedules`, { scheduleToUpdate: newSchedule })
            .then((data) => {
              setSchedules((prevSchedules) => {
                const updatedSchedules = [...prevSchedules];
                updatedSchedules[day][unit] = newSchedule;
                return updatedSchedules;
              });
              console.log("Schedule updated successfully:", data);
            })
            .catch((error) => {
              console.error("Failed to update schedule:", error);
              const errorMessage =
                error.response?.data?.error ||
                error.message ||
                "An unexpected error occurred";
              alert(errorMessage);
            });
        } //לא בטוח שלגמרי נכון לעדכן את המטריצה באוביקט שיצרנו פה ולא עבר דרך השרת
      }
    }
  };

  const calculateYear = (startingYear) => {
    const currentYear = new Date().getFullYear();
    const yearNumber = currentYear - startingYear + 1;
    switch (yearNumber) {
      case 1:
        return "'שנה א";
      case 2:
        return "'שנה ב";
      case 3:
        return "'שנה ג";
      default:
        return "לא ידוע";
    }
  };

  useEffect(() => {
    if (spe) {
      localStorage.setItem("currentSpe", JSON.stringify(spe));
      setCurrentSpe(spe);
    } else {
      const storedSpe = localStorage.getItem("currentSpe");
      if (storedSpe) {
        setCurrentSpe(JSON.parse(storedSpe));
      }
    }
  }, [spe]);
  useEffect(() => {
    if (currentSpe) {
      Read(`/teams/?speName='${currentSpe.SpeName}'`)
        .then((dataTeams) => {
          // console.log(dataTeams);
          setTeamIndex(0);
          setTeams(dataTeams);
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
        });
    }
  }, [currentSpe]);

  useEffect(() => {
    if (teams.length > 0) {
      Read(
        `/courseForTeam/?speName='${currentSpe.SpeName}'&startingStudiesYear=${teams[teamIndex].StartingStudiesYear}&semester='א'`
      )
        .then((data) => {
          const coursesArray = data.map((course) => ({
            courseName: course.CourseName.toString(),
            CTId: course.CTId,
          }));
          setCourses(coursesArray);
          console.log(coursesArray);
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
        setSchedules(
          Array(5)
            .fill()
            .map(() => Array(timesArray.length).fill(new Schedule()))
        );
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
          // console.log(data);
          setSchedulesList(data);
          const updatedSchedules = Array(5)
            .fill()
            .map(() => Array(unitTimes.length).fill(new Schedule()));
          data.forEach((sche) => {
            updatedSchedules[dayMapping[sche.Day] - 1][sche.UnitId] = sche;
            // console.log(sche);
          });
          setSchedules(updatedSchedules);
          // console.log(updatedSchedules);
        })
        .catch((error) => {
          console.error("Error fetching schedules:", error);
        });
    }
  }, [teams, teamIndex]);

  // const courses = ["מתמטיקה", "אנגלית", "מדעים", "היסטוריה"];
  const rooms = ["חדר 101", "חדר 102", "חדר 103", "חדר 104"];

  return (
    <div className="home">
      {currentSpe && schedules ? (
        <>
          <h1> {currentSpe.SpeName}</h1>
          {teams.length > 0 && (
            <>
              <h2>{calculateYear(teams[teamIndex].StartingStudiesYear)}</h2>
              {teams.map((team, index) => {
                if (index !== teamIndex) {
                  return (
                    <button key={index} onClick={() => setTeamIndex(index)}>
                      {`מעבר ל${calculateYear(team.StartingStudiesYear)}`}
                    </button>
                  );
                }
                return null;
              })}
            </>
          )}
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
                  {daysOfWeek.map((day, colIndex) => {
                    const schedule = schedules[colIndex]?.[rowIndex] || {};
                    return (
                      <td
                        key={colIndex}
                        className={
                          schedule.SchedId ? "scheduled" : "unScheduled"
                        }
                      >
                        <input
                          type="time"
                          value={schedule.BeginningTime || hour.BeginningTime}
                          onChange={(e) =>
                            updateSchedule(
                              colIndex,
                              rowIndex,
                              "BeginningTime",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="time"
                          value={schedule.EndTime || hour.EndTime}
                          onChange={(e) =>
                            updateSchedule(
                              colIndex,
                              rowIndex,
                              "EndTime",
                              e.target.value
                            )
                          }
                        />
                        <select
                          value={schedule.CTId || ""}
                          onChange={(e) =>
                            updateSchedule(
                              colIndex,
                              rowIndex,
                              "CTId",
                              Number(e.target.value)
                            )
                          }
                        >
                          <option value="" disabled selected>
                            בחר קורס
                          </option>
                          {courses.map((course, courseIndex) => (
                            <option key={courseIndex} value={course.CTId}>
                              {course.courseName}
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
                          onClick={() => handleSchedule(colIndex, rowIndex)}
                        >
                          שבץ
                        </button>
                      </td>
                    );
                  })}
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
                state: {
                  speObj: new Specialization(),
                  addUpdateStatus: "הוספה",
                },
              });
            }}
          >
            הוספת מגמה
          </button>

          <button
            onClick={() => {
              navigate(`addTeam`, { state: { spe: currentSpe } });
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
            onClick={() => {
              navigate("addCourse", {
                state: { team: teams[teamIndex], spe: currentSpe },
              });
            }}
          >
            הוספת קורס
          </button>
          <Link to={`${currentSpe.SpeName}/teachers`}>
            <button>רשימת מורות</button>
          </Link>
          <Link to={`${currentSpe.SpeName}/courses`}>
            <button>רשימת קורסים</button>
          </Link>
        </>
      ) : null}
    </div>
  );
}

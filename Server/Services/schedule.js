const conDB = require("../DataBase/tables/connectToDB");

async function scheduleForTeacher(empId, callBack, resToCallBack) {
  try {
    const [scheduledList] = await conDB.promise().query(
      `SELECT
  s.UnitId,
  s.Day,
  s.BeginningTime,
  s.EndTime,
  c.CourseName,
  sp.SpeName      AS MegamaName,
  CASE 
    WHEN YEAR(CURDATE()) - t.StartingStudiesYear = 1 THEN 'א'
    WHEN YEAR(CURDATE()) - t.StartingStudiesYear = 2 THEN 'ב'
    WHEN YEAR(CURDATE()) - t.StartingStudiesYear = 3 THEN 'ג'
  END AS YearLetter
FROM schedule      AS s
JOIN courseForTeam AS ctf ON s.CTId = ctf.CTId
JOIN course        AS c   ON ctf.CourseId = c.CourseId
JOIN team          AS t   ON ctf.TeamId   = t.TeamId
JOIN specialization AS sp ON t.SpeId      = sp.SpeId
WHERE ctf.EmpId = ?                      -- מזהה המורה
  AND (YEAR(CURDATE()) - t.StartingStudiesYear) IN (0,1,2)  ;`,
      [empId]
    );

    return callBack(null, scheduledList, resToCallBack);
  } catch (error) {
    console.error("Error fetching schedule for teacher:", error);
    return callBack(error, null, resToCallBack);
  }
}

module.exports = scheduleForTeacher;

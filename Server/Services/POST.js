const validator = require("validator");
const isValidIsraeliID = require("./exportFunctions");
const conDB = require("../DataBase/tables/connectToDB");
const bcrypt = require("bcrypt");
const Update = require("./PUT");
const Read = require("./GET");
function checkScheduleConflict(day, ctId, beginningTime1, endTime1, callback) {
  console.log(
    `Checking schedule conflict for day: ${day}, ctId: ${ctId}, beginningTime1: ${beginningTime1}, endTime1: ${endTime1}`
  );

  const sqlQuery = `
    SELECT * 
    FROM schedule s 
    NATURAL JOIN courseForTeam cft 
    WHERE s.Day = '${day}' 
    AND cft.EmpId = (SELECT EmpId FROM courseForTeam WHERE CTId = ${ctId}) 
    AND (s.BeginningTime < '${endTime1}' AND s.EndTime > '${beginningTime1}')`;

  conDB.query(sqlQuery, (error, result) => {
    if (error) {
      return callback(error, null);
    }
    if (result.length > 0) {
      console.log(`התנגשות`);

      return callback(null, true); // יש התנגשות
    } else {
      return callback(null, false); // אין התנגשות
    }
  });
}

async function generatePasswordHash(password) {
  return bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .catch((error) => {
      console.error("Error generating password hash:", error);
      throw error;
    });
}

function insertIntoDatabase(tableName, newObj, callBack, resToCallBack) {
  const columns = Object.keys(newObj).join(", ");
  const values = Object.values(newObj)
    .map((value) =>
      typeof value === "boolean" ? (value ? "1" : "0") : `'${value}'`
    )
    .join(", ");
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

  conDB.query(query, (error, result) => {
    if (error) {
      console.log("query", query);
      console.log("error", error);
      return callBack(error, null);
    }
    console.log(result);
    callBack(null, result.insertId, resToCallBack);
  });
}

function Insert(tableName, newObj, callBack, resToCallBack) {
  const errors = []; // נבדוק תקינות עבור כל שדה ונוסיף שגיאות למערך אם נמצאו
  console.log("post", newObj);
  switch (tableName) {
    case "employee":
      let {
        EmpId,
        ID,
        FirstName,
        LastName,
        Email,
        PhoneNumber1,
        PhoneNumber2,
        City,
        Street,
        HouseNumber,
        ZipCode,
        Password_hash,
      } = newObj;
      if (!ID || ID.length !== 9 || !isValidIsraeliID(ID)) {
        errors.push("Invalid ID");
      }
      if (!FirstName) {
        errors.push("First name cannot be empty");
      }
      if (!LastName) {
        errors.push("Last name cannot be empty");
      }
      if (Email && !validator.isEmail(Email)) {
        //.substring(1, Email.length - 1)
        errors.push("Invalid email format");
      }
      if (
        PhoneNumber1 &&
        !validator.isMobilePhone(PhoneNumber1, "any", { strictMode: false })
      ) {
        errors.push("Invalid phone number 1");
      }
      if (
        PhoneNumber2 &&
        !validator.isMobilePhone(PhoneNumber2, "any", { strictMode: false })
      ) {
        errors.push("Invalid phone number 2");
      }
      if (City && City.length > 20) {
        errors.push("City name is too long");
      }
      if (Street && Street.length > 30) {
        errors.push("Street name is too long");
      }
      if (HouseNumber && HouseNumber.length > 10) {
        errors.push("House number is too long");
      }
      if (ZipCode && ZipCode.length > 10) {
        errors.push("Zip code is too long");
      }
      if (errors.length > 0) {
        // console.log("Errors found:");
        errors.forEach((error) => console.log(error));
      }
      if (errors.length == 0 && PhoneNumber1 && PhoneNumber1 != "") {
        newObj.Status = 1;
      } else {
        newObj.Status = 0;
      }
      if (Password_hash) {
        generatePasswordHash(Password_hash)
          .then((hashedPassword) => {
            newObj.Password_hash = hashedPassword;
            insertIntoDatabase(tableName, newObj, callBack, resToCallBack);
          })
          .catch((error) => {
            callBack(["Error hashing password"], null);
          });
        return;
      }
      //else {
      //   insertIntoDatabase(tableName, newObj, callBack);
      // }
      break;

    case "unit":
      const { UnitId, BeginningTime, EndTime } = newObj;

      if (
        BeginningTime &&
        !validator.isISO8601(`1970-01-01T${BeginningTime}Z`, { strict: true })
      ) {
        errors.push("Invalid beginning time format");
      }
      if (
        EndTime &&
        !validator.isISO8601(`1970-01-01T${EndTime}Z`, { strict: true })
      ) {
        errors.push("Invalid end time format");
      }
      break;

    case "team":
      const { teamId, speId1, teamName, studentsNumber, startingStudiesYear } =
        newObj; // לפי מה הוא מכניס את הערכים לאובייקט? לפי השמות שלהם או לפי הסדר?

      if (teamName && teamName.length > 10) {
        errors.push("TeamName is too long");
      }
      if (studentsNumber && typeof studentsNumber !== "number") {
        errors.push("StudentsNumber must be a number");
      }
      if (startingStudiesYear && startingStudiesYear.length > 10) {
        errors.push("StartingStudiesYear is too long");
      }
      break;

    case "specialization":
      const { SpeId, SpeName: speName, EmpId: empId } = newObj;

      if (!speName || speName.length > 30) {
        errors.push("SpeName cannot be empty or too long");
      }
      if (!empId) errors.push("EmpId is required");
      if (errors.length > 0) break;

      const promoteQuery = `UPDATE employee SET Role = 'Coordinator' WHERE EmpId = ${empId} AND Role = 'Teacher'`;
      conDB.query(promoteQuery, (err) => {
        if (err) {
          console.error("Error updating employee role:", err);
          return callBack(
            "Failed to promote employee to Coordinator",
            null,
            resToCallBack
          );
        }
      });
      break;

    case "schedule":
      const { schedId, CtId, UnitId1, Day, BeginningTime1, EndTime1 } = newObj;

      // if (Day && !validator.isDate(Day)) {
      //   errors.push("Invalid day format");
      // }
      if (
        BeginningTime1 &&
        !validator.isTime(BeginningTime1, { format: "HH:mm:ss" })
      ) {
        errors.push("Invalid beginning time format");
      }
      if (EndTime1 && !validator.isTime(EndTime1, { format: "HH:mm:ss" })) {
        errors.push("Invalid end time format");
      }
      break;

    case "courseForTeam":
      const { ctId1, courseId, teamId1, semester, empId2 } = newObj;

      if (semester && semester.length > 10) {
        errors.push("Semester is too long");
      }
      if (empId2 && typeof empId2 !== "number") {
        errors.push("EmpId must be a number");
      }
      break;

    case "course":
      const { CourseId1, CourseName, HoursPerYear } = newObj;

      if (!CourseName) {
        errors.push("CourseName cannot be empty");
      }
      if (!HoursPerYear) {
        errors.push("HoursPerYear cannot be empty");
      }
      break;
  }

  console.log("errors find? --", errors);
  if (errors.length > 0) {
    console.log("Errors found:");
    errors.forEach((error) => console.log(error));
    //איך אני אתייחס למערך השגיאות?
    callBack(errors, null, resToCallBack); // נפסיק את הביצוע של הפונקציה כאן ולא נמשיך לשלוף נתונים מהמסד ולשלוח שאילתות
    return;
  }

  if (tableName === "schedule") {
    // שליפת ערכים נדרשים מה־newObj
    const { schedId, CTId, UnitId, Day, BeginningTime, EndTime } = newObj;

    // 1. קודם בודקים התנגשות כללית עם checkScheduleConflict
    checkScheduleConflict(
      Day,
      CTId,
      BeginningTime,
      EndTime,
      (error, conflict) => {
        if (error) {
          // אם יש שגיאה בבדיקת התנגשות – שולחים ומסתיימים
          return callBack(error, null, resToCallBack);
        }
        if (conflict) {
          // אם כבר יש התנגשות בשעות מורה – שולחים הודעה ומסתיימים
          return callBack(
            "לא ניתן לשבץ קורס זה כי המורה מלמדת בקבוצה אחרת בשעה זו",
            null,
            resToCallBack
          );
        }

        // 2. אם אין התנגשות, שולפים את שעות היחידה מתוך הטבלה "unit"
        const unitQuery = `
        SELECT BeginningTime, EndTime 
        FROM unit 
        WHERE UnitId = ${UnitId}
      `;
        conDB.query(unitQuery, (unitErr, unitResults) => {
          if (unitErr) {
            return callBack("שגיאה בשליפת שעות היחידה", null, resToCallBack);
          }
          console.log("unitResults", unitResults);
          
          if (!unitResults || unitResults.length === 0) {
            return callBack("היחידה לא נמצאה", null, resToCallBack);
          }

          // המרת הזמנים לשניות כדי להשוות
          const parseTime = (t) => {
            const [h, m, s] = t.split(":").map(Number);
            return h * 3600 + m * 60 + (s || 0);
          };
          const unitBegin = parseTime(unitResults[0].BeginningTime);
          const unitEnd = parseTime(unitResults[0].EndTime);
          const schedBegin = parseTime(BeginningTime);
          const schedEnd = parseTime(EndTime);

          // בודקים חריגה מותרת: סטייה של שעה (3600 שניות)
          if (schedBegin < unitBegin - 3600 || schedBegin > unitBegin + 3600) {
            return callBack(
              "שעת התחלה חורגת ביותר משעה מהיחידה",
              null,
              resToCallBack
            );
          }
          if (schedEnd < unitEnd - 3600 || schedEnd > unitEnd + 3600) {
            return callBack(
              "שעת סיום חורגת ביותר משעה מהיחידה",
              null,
              resToCallBack
            );
          }

          // 3. כעת בודקים חפיפה עם יחידות סמוכות לאותה קבוצה
          const neighborUnitsQuery = `
          SELECT s2.BeginningTime, s2.EndTime
          FROM schedule s2
          WHERE s2.CTId IN (
            SELECT CTId 
            FROM courseForTeam 
            WHERE TeamId = (
              SELECT TeamId 
              FROM courseForTeam 
              WHERE CTId = ${conDB.escape(CTId)}
            )
          )
          AND s2.Day = ${conDB.escape(Day)}
          AND s2.UnitId != ${conDB.escape(UnitId)}
        `;
          conDB.query(neighborUnitsQuery, (neighErr, neighResults) => {
            if (neighErr) {
              return callBack(
                "שגיאה בבדיקת יחידות סמוכות",
                null,
                resToCallBack
              );
            }

            // בודקים אם יש חפיפה בין הזמנים
            const overlap = neighResults.some((row) => {
              const nBegin = parseTime(row.BeginningTime);
              const nEnd = parseTime(row.EndTime);
              return schedBegin < nEnd && schedEnd > nBegin;
            });
            if (overlap) {
              return callBack(
                "יש חפיפה בשעות עם יחידה סמוכה לאותה קבוצה",
                null,
                resToCallBack
              );
            }

            // 4. אם כל הבדיקות עברו – מבצעים INSERT אחד ויחיד
            const columns = Object.keys(newObj).join(", ");
            const values = Object.values(newObj)
              .map((v) => (typeof v === "boolean" ? (v ? "1" : "0") : `'${v}'`))
              .join(", ");
            const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

            conDB.query(insertQuery, (insertErr, insertResult) => {
              if (insertErr) {
                return callBack(insertErr, null, resToCallBack);
              }
              return callBack(null, insertResult.insertId, resToCallBack);
            });
          });
        });
      }
    );
  } else {
    console.log(newObj);

    const columns = Object.keys(newObj).join(", ");
    const values = Object.values(newObj)
      .map((value) =>
        typeof value === "boolean" ? (value ? "1" : "0") : `'${value}'`
      )
      .join(", ");
    console.log(columns, values);
    var query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
    conDB.query(query, values, (error, result) => {
      if (error) {
        console.log("error.sql", error.sql);
        console.log("query", query);
        console.log("error", error.sqlMessage); //speId לא הגיע
        return callBack(error.sqlMessage, null, resToCallBack);
      }
      console.log(result);
      callBack(null, result.insertId, resToCallBack);
    });
  }
}

module.exports = Insert;

//לבדוק שאין פגיעות בשעות בהוספת שיבוץ

// {
//   "newEmployee": {
//       "ID": "326619269",
//       "FirstName": "פרל",
//       "LastName": "נדל",
//       "Email": "",
//       "PhoneNumber1": "",
//       "PhoneNumber2": "",
//       "City": "",
//       "Street": "",
//       "HouseNumber": "",
//       "ZipCode": ""
//   }
// }

// {
//   "newUnit": {
//     "UnitId": 3,
//     "BeginningTime": "18:30:00",
//     "EndTime": "20:00:00"
//   }
// }

// {
//   "newSpe": {
//     "SpeName": "אומנות",
//     "EmpId": "2"
//   }
// }

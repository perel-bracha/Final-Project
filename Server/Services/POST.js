const validator = require("validator");
const isValidIsraeliID = require("./exportFunctions");
const conDB = require("../DataBase/tables/connectToDB");

function checkScheduleConflict(day, ctId, beginningTime1, endTime1, callback) {
  const sqlQuery = `
    SELECT * 
    FROM schedule s 
    NATURAL JOIN courseForTeam cft 
    WHERE s.Day = ${conDB.escape(day)} 
    AND cft.EmpId = (SELECT EmpId FROM courseForTeam WHERE CTId = ${conDB.escape(
      ctId
    )}) 
    AND (s.BeginningTime < ${conDB.escape(
      endTime1
    )} AND s.EndTime > ${conDB.escape(beginningTime1)})
  `;

  conDB.query(sqlQuery, (error, result) => {
    if (error) {
      return callback(error, null);
    }
    if (result.length > 0) {
      return callback(null, true); // יש התנגשות
    } else {
      return callback(null, false); // אין התנגשות
    }
  });
}

function Insert(tableName, newObj, callBack, resToCallBack) {
  const errors = []; // נבדוק תקינות עבור כל שדה ונוסיף שגיאות למערך אם נמצאו
  console.log(`post ${newObj}`);
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
      const { speId, speName, empId1 } = newObj;

      if (speName && speName.length > 30) {
        errors.push("SpeName is too long");
      }

      break;

    case "schedule":
      const { schedId, ctId, unitId1, day, beginningTime1, endTime1 } = newObj;

      if (day && !validator.isDate(day)) {
        errors.push("Invalid day format");
      }
      if (
        beginningTime1 &&
        !validator.isTime(beginningTime1, { format: "HH:mm:ss" })
      ) {
        errors.push("Invalid beginning time format");
      }
      if (endTime1 && !validator.isTime(endTime1, { format: "HH:mm:ss" })) {
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

      if (!courseName) {
        errors.push("CourseName cannot be empty");
      }
      if (!hoursPerYear) {
        errors.push("HoursPerYear cannot be empty");
      }
      break;
  }

  if (errors.length > 0) {
    console.log("Errors found:");
    errors.forEach((error) => console.log(error));
    //איך אני אתייחס למערך השגיאות?
    callBack(errors, null, resToCallBack); // נפסיק את הביצוע של הפונקציה כאן ולא נמשיך לשלוף נתונים מהמסד ולשלוח שאילתות
    return;
  }

  if (tableName === "schedule") {
    const { schedId, ctId, unitId1, day, beginningTime1, endTime1 } = newObj;

    checkScheduleConflict(
      day,
      ctId,
      beginningTime1,
      endTime1,
      (error, conflict) => {
        if (error) {
          console.error("Error during schedule conflict check:", error);
          callBack(error, null, resToCallBack);
          return;
        }
        if (conflict) {
          errors.push(
            "לא ניתן לשבץ קורס זה מכיוון שהמורה מלמדת בקבוצה אחרת בשעה זו"
          );
          console.log(errors[0]);
          callBack(errors, null, resToCallBack);
          return;
        }

        // אם אין שגיאות ואין התנגשות, ממשיכים לשאילתת ה-INSERT
        const columns = Object.keys(newObj).join(", ");
        const values = Object.values(newObj)
          .map((value) =>
            typeof value === "boolean" ? (value ? "1" : "0") : `'${value}'`
          )
          .join(", ");
        console.log(columns, values);

        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
        conDB.query(query, (error, result) => {
          if (error) {
            console.log("query", query);
            console.log("error", error);
            return callBack(error, null, resToCallBack);
          }
          console.log(result);
          callBack(null, result.insertId, resToCallBack);
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
        console.log("query", query);
        console.log("error", error); //speId לא הגיע
        return callBack(error, null, resToCallBack);
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

const validator = require("validator");
const isValidIsraeliID = require("./exportFunctions");

const conDB = require("../DataBase/tables/connectToDB");

function Insert(tableName, newObj, callBack, resToCallBack) {
  const errors = []; // נבדוק תקינות עבור כל שדה ונוסיף שגיאות למערך אם נמצאו
  console.log(newObj);
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
      if (Email && !validator.isEmail(Email.substring(1, Email.length - 1))) {
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
        newObj.Status = 'TRUE';
      } else {
        newObj.Status = 'FALSE';
      }
      break;

    case "unit":
      const { unitId, beginningTime, endTime } = newObj;

      if (
        beginningTime &&
        !validator.isTime(beginningTime, { format: "HH:mm:ss" })
      ) {
        errors.push("Invalid beginning time format");
      }
      if (endTime && !validator.isTime(endTime, { format: "HH:mm:ss" })) {
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
      const { courseId1, courseName, hoursPerYear } = newObj;

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
  }
  console.log(newObj);

  const columns = Object.keys(newObj)
    .map((key) => ` ?`)
    .join(", "); //${key} =
  const values = Object.values(newObj);

  var query = `INSERT INTO ${tableName} VALUES (${values})`;
  conDB.query(query, values, (error, result) => {
    if (error) {
      return callBack(error, null, resToCallBack);
    }
    callBack(null, result.insertId, resToCallBack);
  });

  //   var query = `INSERT INTO ${tableName} SET = ${newObj}`;
  //   conDB.query(query, (error, result) => {
  //     callBack(error, result, resToCallBack); //אנ ירוצה להחזיר את הid החדש איך אני מוצאת אותו?
  //   });
}

module.exports = Insert;

//לבדוק שאין פגיעות בשעות בהוספת שיבוץ

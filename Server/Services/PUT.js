const conDB = require("../DataBase/tables/connectToDB");
const validator = require("validator");

function Update(tableName, objToUpdate, callBack, resToCallBack) {
  const errors = []; // נבדוק תקינות עבור כל שדה ונוסיף שגיאות למערך אם נמצאו
  console.log(objToUpdate);

  switch (tableName) {
    case "employee": //empId, id, firstName, lastName, email, phoneNumber1, phoneNumber2, city, street, houseNumber, zipCode
      let {
        EmpId,
        Id,
        FirstName,
        LastName,
        Email,
        PhoneNumber1,
        PhoneNumber2,
        City,
        Street,
        HouseNumber,
        ZipCode,
        Status,
      } = objToUpdate;

      // if (!empId) {//??
      //   errors.push("empId cannot be empty");
      // }
      // if (!id || id.length !== 9) {
      //   errors.push("Invalid ID");
      // }
      if (!FirstName) {
        errors.push("First name cannot be empty");
      }
      if (!LastName) {
        errors.push("Last name cannot be empty");
      }
      if (Email && !validator.isEmail(Email)) {
        errors.push("Invalid email format");
      }
      const isIsraeliPhone = /^0\d(-)?\d{7}$|^\d{3}(-)?\d{7}$/;
      if (
        !PhoneNumber1 ||
        !(
          validator.isMobilePhone(PhoneNumber1, "any", { strictMode: false }) ||
          isIsraeliPhone.test(PhoneNumber1)
        )
      ) {
        errors.push("Invalid phone number 1");
      }
      if (
        PhoneNumber2 &&
        !(
          validator.isMobilePhone(PhoneNumber2, "any", { strictMode: false }) ||
          isIsraeliPhone.test(PhoneNumber2)
        )
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
      console.log(Status);
      if (Status != false && Status != true) {
        errors.push("Status is invalid");
      }
      if (errors.length > 0) {
        console.log("Errors found:");

        errors.forEach((error) => console.log(error));
      }
      break;

    case "unit":
      const { unitId, beginningTime, endTime } = objToUpdate;

      // if (!unitId) {//??האם צריך לבדוק שהמספר מזהה קיים או שאין מצב אחר
      //   errors.push("UnitId cannot be empty");
      // }
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
        objToUpdate; // לפי מה הוא מכניס את הערכים לאובייקט? לפי השמות שלהם או לפי הסדר?
      if (!teamId) {
        //?האם צריך לבדוק שהמספר מזהה קיים או שאין מצב אחר
        errors.push("TeamId cannot be empty");
      }
      if (speId1 && typeof speId1 !== "number") {
        errors.push("SpeId must be a number");
      }
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
      const { speId, speName, empId1 } = objToUpdate;

      if (!speId) {
        errors.push("SpeId cannot be empty");
      }
      if (speName && speName.length > 30) {
        errors.push("SpeName is too long");
      }
      if (empId1 && typeof empId1 !== "number") {
        errors.push("EmpId must be a number");
      }
      break;

    case "schedule":
      const { schedId, ctId, unitId1, day, beginningTime1, endTime1 } =
        objToUpdate;

      // if (!schedId) {
      //   errors.push("SchedId cannot be empty");
      // }
      if (ctId && typeof ctId !== "number") {
        errors.push("CTId must be a number");
      }
      if (unitId1 && typeof unitId1 !== "number") {
        errors.push("UnitId must be a number");
      }
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
      const { ctId1, courseId, teamId1, semester, empId2 } = objToUpdate;

      // if (!ctId1) {
      //   errors.push("CTId cannot be empty");
      // }
      if (courseId && typeof courseId !== "number") {
        errors.push("CourseId must be a number");
      }
      if (teamId1 && typeof teamId1 !== "number") {
        errors.push("TeamId must be a number");
      }
      if (semester && semester.length > 10) {
        errors.push("Semester is too long");
      }
      if (empId2 && typeof empId2 !== "number") {
        errors.push("EmpId must be a number");
      }
      break;

    case "course":
      const { courseId1, courseName, hoursPerYear } = objToUpdate;

      // if (!courseId1) {
      //   errors.push("CourseId cannot be empty");
      // }
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
    return callBack(errors, null, resToCallBack); // נפסיק את הביצוע של הפונקציה כאן ולא נמשיך לשלוף נתונים מהמסד ולשלוח שאילתות
  }

  // console.log("Object update is valid");
  // console.log(objToUpdate.ID);
  const set = Object.keys(objToUpdate);
  const setClause = set
    .slice(1) // Exclude the first key
    .map((key) => {
      const value =
        typeof objToUpdate[key] === "boolean"
          ? objToUpdate[key]
            ? "1"
            : "0"
          : `'${objToUpdate[key]}'`;
      return `${key} = ${value}`;
    })
    .join(", ");
  // console.log(objToUpdate[0]);
  var query = `UPDATE ${tableName} SET ${setClause} WHERE ${set[0]} = ${
    objToUpdate[set[0]]
  }`;
  conDB.query(query, (error, result) => {
    callBack(error, result, resToCallBack); //מה חוזר מהפונקציה?
  });
}
module.exports = Update;

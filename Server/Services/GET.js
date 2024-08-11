const conDB = require("../DataBase/tables/connectToDB");

function Read(tableName, searchParams, callBack, resToCallBack) {
  console.log(searchParams);
  let searchQuery = "";
  let columns = "*";
  switch (tableName) {
    case "team":
      if (searchParams.startingStudiesYear != undefined)
        searchQuery = `WHERE StartingStudiesYear=${searchParams.startingStudiesYear} `;
      if (searchParams.speName != undefined) {
        searchQuery += searchQuery != "" ? `AND ` : `WHERE `;
        searchQuery += `SpeId = (SELECT SpeId FROM specialization WHERE SpeName=${searchParams.speName})`;
      }
      break;

    case "schedule":
      if (
        searchParams.unitId != undefined &&
        searchParams.day != undefined &&
        searchParams.teamId != undefined
      )
      searchQuery=`s WHERE UnitId=${searchParams.unitId} AND Day=${searchParams.day} AND ${searchParams.teamId}=(SELECT TeamId FROM courseForTeam ct WHERE ct.CTId=s.CTId)`
        break;

    case "courseForTeam":
      if (
        // searchParams.speName != null &&
        searchParams.speName != undefined &&
        // searchParams.startingStudiesYear != null &&
        searchParams.startingStudiesYear != undefined &&
        searchParams.semester != undefined
      )
        searchQuery = `NATURAL JOIN employee WHERE Semester=${searchParams.semester} AND TeamId = SELECT TeamId FROM team WHERE StartingStudiesYear=${searchParams.startingStudiesYear} AND SpeId = (SELECT SpeId FROM specialization WHERE SpeName=${searchParams.speName})`;
      // searchQuery = `cft NATURAL JOIN team t NATURAL JOIN specialization s WHERE t.StartingStudiesYear=${searchParams.startingStudiesYear} AND s.SpeName= ${searchParams.speName} AND (ctf.Semester=${searchParams.semester} OR ctf.Semester="שנתי")`;
      columns = "CTId, CourseId,  semester, FirstName, LastName";
      break;
      

    case "employee":
      if (searchParams.login != undefined) searchParams.login = undefined;
      else {
        searchQuery = "Status=TRUE AND ";
        console.log(`checkStatus ${searchParams.login}`);
      }
      console.log(searchParams);
    default:
      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key] != null && searchParams[key] != undefined)
          searchQuery += `${key}=${searchParams[key]} AND `;
      });
      if (searchQuery != "") {
        searchQuery = "WHERE " + searchQuery;
        searchQuery = searchQuery.slice(0, -4);
      }
      break;
  }

  let readQuery = `SELECT ${columns} FROM ${tableName} ${searchQuery} `;

  conDB.query(readQuery, (error, result) => {
    //מה מגיע בresult?
    callBack(error, result, resToCallBack);
  });
}
module.exports = Read;

//שאלות למורה:
//??שאילתא לכל מקרה
//צריך לבדוק התאמה בין הטבלאות ? או שזה משהו אוטומטי בתלויות
//האם ההתעסקות עם השגיאות היא הגיונית?- שאספנו את כל השגיאות האפשריות למערך
//האם צריך לוודא שה empid .קיים בעדכון או שהד"ב מזהה את זה?
//?איך עובד המספר הרץ
// ?במחיקה ועדכון האם מה הענין של הדב ומה שלנו
//?מה חוזר מהפונקציה

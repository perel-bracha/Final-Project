// //connect to mysql2
// var mysql = require("mysql2");

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "NaomSql.3425",
//   port: 3306
// });

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE schedule_db", function (err, result) {
//     if (err) throw err;
//     console.log("Schedule database created");
//   });
// });
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "94918765",
  port: 3306
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  const checkDatabaseQuery = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'schedule_db'";
  
  con.query(checkDatabaseQuery, function (err, result) {
    if (err) throw err;

    if (result.length === 0) {
      // אם מסד הנתונים לא קיים, ליצור אותו
      const createDatabaseQuery = "CREATE DATABASE schedule_db";
      con.query(createDatabaseQuery, function (err, result) {
        if (err) throw err;
        console.log("Schedule database created");
      });
    } else {
      console.log("Database 'schedule_db' already exists. Skipping creation.");
    }
  });
});

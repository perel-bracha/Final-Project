const mysql = require("mysql2");
require('dotenv').config();

const password = process.env.SQL_PASSWORD;

function resetDB() {
  return new Promise((resolve, reject) => {
    const con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: password,
      port: 3306
    });

    con.connect(function (err) {
      if (err) return reject(err);
      console.log("Connected!");

      const dropDatabaseQuery = "DROP DATABASE IF EXISTS schedule_db";
      const createDatabaseQuery = "CREATE DATABASE schedule_db";

      con.query(dropDatabaseQuery, function (err, result) {
        if (err) return reject(err);
        console.log("Dropped existing database (if existed).");

        con.query(createDatabaseQuery, function (err, result) {
          if (err) return reject(err);
          console.log("Schedule database created.");
          resolve(); // החזרת הפתרון כאשר הפעולה הסתיימה
        });
      });
    });
  });
}

module.exports = resetDB;



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

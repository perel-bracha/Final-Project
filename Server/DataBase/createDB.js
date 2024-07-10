//connect to mysql2
var mysql = require("mysql2");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ofakim123?",
  port: 3306
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE schedule_db", function (err, result) {
    if (err) throw err;
    console.log("Schedule database created");
  });
});

var mysql = require("mysql2");
const password = process.env.SQL_PASSWORD;

var conDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: password,
  database: "schedule_db",
});

conDB.connect(function (err) {
  if (err) throw err;
  console.log("Connected to schedule_db succied"); //**
});

module.exports = conDB;

var mysql = require("mysql2");

var conDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ofakim123?",
  database: "schedule_db",
});

conDB.connect(function (err) {
  if (err) throw err;
  console.log("Connected to schedule_db succied");//**
});

module.exports = conDB;
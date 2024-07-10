const conDB = require("./connectToDB");

var createEmp ="CREATE TABLE specialization (    SpeId   INT     AUTO_INCREMENT  PRIMARY KEY  NOT NULL,    SpeName NVARCHAR (30) NULL,    EmpId   INT           NULL,     FOREIGN KEY (EmpId) REFERENCES employee (EmpId));"


conDB.query(createEmp, function (err, result) {
  if (err) throw err;
  console.log("Specialization table created");
});










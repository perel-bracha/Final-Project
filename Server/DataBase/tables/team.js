const conDB = require("./connectToDB");

var createGroup =
  "CREATE TABLE team( TeamId INT AUTO_INCREMENT  PRIMARY KEY     NOT NULL,    SpeId  INT   NULL,  StudentsNumber     INT   NULL,    StartingStudiesYear CHAR (10)     NULL,    FOREIGN KEY (SpeId) REFERENCES specialization (SpeId)  )";
//var drop="ALTER TABLE team DROP COLUMN TeamName"
 
conDB.query(createGroup, function (err, result) {
  if (err) throw err;
  console.log("Team table created");
});

//** */
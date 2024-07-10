const conDB = require("./connectToDB");

var createCourseForTeam =
  "CREATE TABLE courseForTeam ( CTId   INT   PRIMARY KEY AUTO_INCREMENT NOT NULL, CourseId INT  NULL, TeamId  INT    NULL, Semester NVARCHAR (10) NULL, EmpId    INT     NULL, FOREIGN KEY (CourseId) REFERENCES course(CourseId), FOREIGN KEY (TeamId) REFERENCES team(TeamId), FOREIGN KEY (EmpId) REFERENCES employee(EmpId));";

conDB.query(createCourseForTeam, function (err, result) {
  if (err) throw err;
  console.log("CourseForTeam table created");
});
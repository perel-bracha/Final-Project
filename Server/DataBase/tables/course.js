const conDB = require("./connectToDB");

var createCourse =
  "CREATE TABLE course ( CourseId  INT AUTO_INCREMENT  PRIMARY KEY   NOT NULL, CourseName NVARCHAR (30)   NOT NULL, HoursPerYear  CHAR (10) NOT NULL)";


conDB.query(createCourse, function (err, result) {
  if (err) throw err;
  console.log("Course table created");
});


const conDB = require("./connectToDB");

var createschedule ="CREATE TABLE schedule (  SchedId     INT    PRIMARY KEY  AUTO_INCREMENT NOT NULL,   CTId  INT      NULL,    UnitId        INT      NULL,    Day          DATE     NULL,    BeginningTime TIME (6) NULL,    EndTime       TIME (6) NULL,    FOREIGN KEY (CTId) REFERENCES CourseForTeam (CTId),    FOREIGN KEY (UnitId) REFERENCES Unit (UnitId))";
var alterschedule = "ALTER TABLE schedule MODIFY Day INT NULL";

conDB.query(alterschedule, function (err, result) {
  if (err) throw err;
  console.log("Schedule table created");
});


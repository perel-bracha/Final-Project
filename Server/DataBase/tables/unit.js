const conDB = require("./connectToDB");

var createUnit =
  "CREATE TABLE unit (    UnitId  INT   PRIMARY KEY    NOT NULL,    BeginningTime TIME (6) NULL,    EndTime     TIME (6) NULL  )";

conDB.query(createUnit, function (err, result) {
  if (err) throw err;
  console.log("Unit table created");
});







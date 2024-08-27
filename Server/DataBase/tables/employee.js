const conDB = require("./connectToDB");

var createEmp =
  "CREATE TABLE employee ( EmpId  INT AUTO_INCREMENT PRIMARY KEY   NOT NULL, ID CHAR (9)   NOT NULL, FirstName    NVARCHAR (30) NOT NULL, LastName    NVARCHAR (30) NOT NULL, Email  NVARCHAR (40) NULL, PhoneNumber1 NCHAR (10)    NOT NULL, PhoneNumber2 NCHAR (10)    NULL, City    NVARCHAR (20) NULL, Street    NVARCHAR (30) NULL, HouseNumber  VARCHAR (10)  NULL, ZipCode   VARCHAR (10)  NULL, Status BOOLEAN, Password_hash VARCHAR(255) NOT NULL,Role VARCHAR(50) DEFAULT 'Teacher')";

//var addColumn =
  "ALTER TABLE employee ADD COLUMN Role VARCHAR(50) DEFAULT 'Teacher'";
// var addColumn = "ALTER TABLE employee ADD COLUMN Status BOOLEAN;";

conDB.query(createEmp, function (err, result) {
  if (err) throw err;
  console.log("Employee table created"); //*
});

//** */

// Role:
//  Teacher
//  Coordinator
//  Admin
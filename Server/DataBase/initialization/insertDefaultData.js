const conDB = require("../tables/connectToDB");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

function insertData(query, values = []) {
  return new Promise((resolve, reject) => {
    conDB.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// פונקציה ליצירת סיסמה חזקה
function generateRandomPassword(length) {
  //אני שולחת אורך שאני רוצה
  return crypto.randomBytes(length).toString("hex");
}

// לסיסמא hash
async function generatePasswordHash(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
//הכנסת ערכים התחלתיים לטבלאות
async function insertDefaultData() {
  const employees = [
    {
      ID: "342582715",
      FirstName: "נעמי",
      LastName: "לוי",
      Email: "john.doe@example.com",
      PhoneNumber1: "0501234567",
      PhoneNumber2: "",
      Status: 1,
      Role: "Coordinator",
      City: "ירושלים", 
      Street: "",
      HouseNumber: "",
      ZipCode: "",
    },
    {
      ID: "326619269",
      FirstName: "פרל",
      LastName: "נדל",
      Email: "jane.smith@example.com",
      PhoneNumber1: "0507654321",
      PhoneNumber2: "",
      Status: 1,
      Role: "Coordinator",
      City: "תל אביב",
      Street: "",
      HouseNumber: "",
      ZipCode: "",
    },
    {
      ID: "326911955",
      FirstName: "בת שבע",
      LastName: "לוי",
      Email: "smith@example.com",
      PhoneNumber1: "0507654321",
      PhoneNumber2: "",
      Status: 1,
      Role: "Teacher",
      City: "אופקים", 
      Street: "",
      HouseNumber: "",
      ZipCode: "",
    },
  ];

  for (const employee of employees) {
    const password = "notre.Proje"; //generateRandomPassword(4); // אורך הסיסמה הוא 8 תווים
    console.log(password);
    const passwordHash = await generatePasswordHash(password);
    console.log(passwordHash);

    const query = `INSERT INTO employee (ID, FirstName, LastName, Email, PhoneNumber1,PhoneNumber2,City,Street,HouseNumber,ZipCode, Status, Password_hash, Role) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)`;
    const values = [
      employee.ID,
      employee.FirstName,
      employee.LastName,
      employee.Email,
      employee.PhoneNumber1,
      employee.PhoneNumber2,
      employee.City, 
      employee.Street,
      employee.HouseNumber,
      employee.ZipCode,
      employee.Status,
      passwordHash,
      employee.Role,
    ];
    
    await insertData(query, values);
    console.log(`Employee ${employee.ID} inserted with hashed password.`);
  }

  const insertQueries = [
    // נתונים לטבלת employee
    // `INSERT INTO employee (ID, FirstName, LastName, Email, PhoneNumber1, Status) VALUES
    // ('342582715', 'נעמי', 'לוי', 'john.doe@example.com', '0501234567', 1),
    // ('326619269', 'פרל', 'נדל', 'jane.smith@example.com', '0507654321', 1);`,

    // נתונים לטבלת course
    `INSERT INTO course (CourseName, HoursPerYear) VALUES 
    ('Mathematics', '100'),
    ('Computer Science', '120');`,

    // נתונים לטבלת specialization
    `INSERT INTO specialization (SpeName, EmpId) VALUES 
    ('Software Engineering', 1),
    ('Data Science', 2);`,

    // נתונים לטבלת unit
    `INSERT INTO unit (UnitId, BeginningTime, EndTime) VALUES 
    (0, '08:30:00', '13:15:00'),
    (1, '15:00:00', '16:30:00'),
    (2, '16:45:00', '18:15:00'),
    (3, '18:30:00', '20:00:00');`,

    // נתונים לטבלת team
    `INSERT INTO team (SpeId, StudentsNumber, StartingStudiesYear) VALUES 
    (1, 30, '2022'),
    (2, 25, '2023');`,

    // נתונים לטבלת courseForTeam
    `INSERT INTO courseForTeam (CourseId, TeamId, Semester, EmpId) VALUES 
    (1, 1, 'א', 1),
    (2, 2, 'א', 2);`,

    // נתונים לטבלת schedule
    `INSERT INTO schedule (CTId, UnitId, Day, BeginningTime, EndTime) VALUES 
    (1, 1, 1, '08:30:00', '10:00:00'),
    (2, 2, 2, '10:00:00', '12:00:00');`,
  ];

  for (const query of insertQueries) {
    await insertData(query);
    console.log("Query executed:", query);
  }
}

module.exports = insertDefaultData;

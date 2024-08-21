const conDB = require("../tables/connectToDB");

function insertData(query) {
  return new Promise((resolve, reject) => {
    conDB.query(query, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

async function insertDefaultData() {
  const insertQueries = [
    // נתונים לטבלת employee
    `INSERT INTO employee (ID, FirstName, LastName, Email, PhoneNumber1, Status) VALUES 
    ('123456789', 'John', 'Doe', 'john.doe@example.com', '0501234567', 1),
    ('987654321', 'Jane', 'Smith', 'jane.smith@example.com', '0507654321', 1);`,
    
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
    (1, '08:00:00', '10:00:00'),
    (2, '10:00:00', '12:00:00');`,
    
    // נתונים לטבלת team
    `INSERT INTO team (SpeId, StudentsNumber, StartingStudiesYear) VALUES 
    (1, 30, '2022'),
    (2, 25, '2023');`,
    
    // נתונים לטבלת courseForTeam
    `INSERT INTO courseForTeam (CourseId, TeamId, Semester, EmpId) VALUES 
    (1, 1, 'Fall', 1),
    (2, 2, 'Spring', 2);`,
    
    // נתונים לטבלת schedule
    `INSERT INTO schedule (CTId, UnitId, Day, BeginningTime, EndTime) VALUES 
    (1, 1, 1, '08:00:00', '10:00:00'),
    (2, 2, 2, '10:00:00', '12:00:00');`
  ];

  for (const query of insertQueries) {
    await insertData(query);
  }
}

module.exports = insertDefaultData;

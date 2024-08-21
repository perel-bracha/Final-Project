CREATE TABLE courseForTeam (
  CTId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  CourseId INT,
  TeamId INT,
  Semester ENUM('א', 'ב', 'שנתי') NOT NULL,
  EmpId INT,
  FOREIGN KEY (CourseId) REFERENCES course(CourseId),
  FOREIGN KEY (TeamId) REFERENCES team(TeamId),
  FOREIGN KEY (EmpId) REFERENCES employee(EmpId)
);

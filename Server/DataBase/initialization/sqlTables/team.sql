CREATE TABLE team (
  TeamId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  SpeId INT,
  StudentsNumber INT NOT NULL,
  StartingStudiesYear YEAR NOT NULL,
  FOREIGN KEY (SpeId) REFERENCES specialization(SpeId)
);

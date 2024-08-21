CREATE TABLE schedule (
  SchedId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  CTId INT,
  UnitId INT,
  Day ENUM('ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי') NOT NULL,
  BeginningTime TIME NOT NULL,
  EndTime TIME NOT NULL,
  FOREIGN KEY (CTId) REFERENCES courseForTeam(CTId),
  FOREIGN KEY (UnitId) REFERENCES unit(UnitId)
);

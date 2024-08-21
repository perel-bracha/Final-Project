const conDB = require("../tables/connectToDB");

const fs = require("fs");

function createTable(query, tableName) {
  return new Promise((resolve, reject) => {
    conDB.query(query, (err, result) => {
      if (err) return reject(err);
      console.log(`${tableName} table created`);
      resolve(result);
    });
  });
}

async function createTables() {
  const tableFiles = [
    "./sqlTables/employee.sql",
    "./sqlTables/course.sql",
    "./sqlTables/unit.sql",
    "./sqlTables/specialization.sql",
    "./sqlTables/team.sql",
    "./sqlTables/courseForTeam.sql",
    "./sqlTables/schedule.sql"
  ];

  for (const file of tableFiles) {
    const query = fs.readFileSync(file, "utf8");
    const tableName = file.split("/").pop().split(".")[0];
    await createTable(query, tableName);
  }
}

module.exports = createTables;

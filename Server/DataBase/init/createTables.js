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
    "./tables/employee.js",
    "./tables/course.js",
    "./tables/unit.js",
    "./tables/team.js",
    "./tables/specialization.js",
    "./tables/courseForTeam.js",
    "./tables/schedule.js"
  ];

  for (const file of tableFiles) {
    const query = fs.readFileSync(file, "utf8");
    const tableName = file.split("/").pop().split(".")[0];
    await createTable(query, tableName);
  }
}

module.exports = createTables;

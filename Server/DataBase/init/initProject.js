//קובץ איתחול ראשי
const createDB = require("./createDB");
const createTables = require("./createTables");
const insertDefaultData = require("./insertDefaultData");

async function initProject() {
  try {
    await createDB();
    console.log("Database created successfully.");

    await createTables();
    console.log("Tables created successfully.");

    await insertDefaultData();
    console.log("Default data inserted successfully.");
  } catch (err) {
    console.error("Error initializing project:", err);
  }
}

initProject();

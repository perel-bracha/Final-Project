const resetDB = require("../resetDB");
const createTables = require("./createTables");
const insertDefaultData = require("./insertDefaultData");

async function initProject() {
  try {
    await resetDB(); // מחיקת ה-DB אם הוא קיים ויצירתו מחדש
    await createTables(); // יצירת הטבלאות
    await insertDefaultData(); // הוספת הנתונים ההתחלתיים
    console.log("Project initialized successfully!");
  } catch (error) {
    console.error("Error initializing project:", error);
  }
}

initProject();

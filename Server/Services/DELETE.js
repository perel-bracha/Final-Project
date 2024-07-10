// import conDB from "../DataBase/tables/connectToDB";
const conDB = require("../DataBase/tables/connectToDB");

function Delete(tableName, idToDelete, callBack, resToCallBack) {
  var query = `DELETE FROM ${tableName} WHERE id = ${idToDelete}`;
  conDB.query(query, (error, result) => {
    // ??אם המספר לא קיים האם הוא מחזיר שגיאה מתאימה
    callBack(error, result, resToCallBack);
  });
}

module.exports = Delete;

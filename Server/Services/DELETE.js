// import conDB from "../DataBase/tables/connectToDB";
const conDB = require("../DataBase/tables/connectToDB");

function Delete(tableName, column, idToDelete, callBack, resToCallBack) {
  console.log(column, idToDelete);
  var query = `DELETE FROM ${tableName} WHERE ${column} = ${idToDelete}`;
  
  conDB.query(query, (error, result) => {
    // ??אם המספר לא קיים האם הוא מחזיר שגיאה מתאימה
    callBack(error, result, resToCallBack);
  });
}

module.exports = Delete;

const jwt = require("jsonwebtoken");
const conDB = require("../DataBase/tables/connectToDB");

function LogIn(password) {
  let readQuery = `SELECT ID FROM employee WHERE ID=${password}`;

  conDB.query(readQuery, (error, result) => {
    callBack(error, result, resToCallBack);
  });
}

module.exports = LogIn;

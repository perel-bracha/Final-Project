const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const conDB = require("../DataBase/tables/connectToDB");
require("dotenv").config({ path: "./.env" });

//const secretKey = process.env.JWT_SECRET; // השתמשי במפתח סודי מוגדר מראש
const secretKey =
  process.env.JWT_SECRET || "Naomie&Perel@Schedule_project.2715.2969";

console.log("secretKey: ", secretKey);

async function LogIn(employeeID, plainPassword, callBack) {
  console.log("in LOG");
  let readQuery = `SELECT * FROM employee WHERE ID=${employeeID}`;
  console.log("in LOG line 15 ");
  conDB.query(readQuery, (error, result) => {
    if (error) {
      console.log("error in readQuery", error);
      return callBack(error);
    }

    const user = result[0];

    if (!user) {
      return callBack(new Error("User not found")); //עושים זריקת שגיאה או חזרה עם שגיאה??
    }
    console.log("user:", user); //V arr
    console.log("passwordU:", user.Password_hash);

    // בדיקת הסיסמה
    console.log(user.Password_hash);

    bcrypt.compare(plainPassword, user.Password_hash, (err, isMatch) => {
      if (err) {
        return callBack(err);
      }
      if (!isMatch) {
        return callBack(new Error("Incorrect password"));
      }
      console.log("secretKey: ", secretKey);
      try {
        const token = jwt.sign({ userId: user.ID }, secretKey, {
          expiresIn: "1h",
        });
        console.log("token", token);
        callBack(null, token);
      } catch (signError) {
        return callBack(signError);
      }
    });
  });
}

module.exports = LogIn;

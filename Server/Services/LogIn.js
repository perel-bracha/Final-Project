const jwt = require("jsonwebtoken");
require('dotenv').config();

const conDB = require("../DataBase/tables/connectToDB");
const secretKey = process.env.JWT_SECRET; // השתמשי במפתח סודי מוגדר מראש

async function LogIn(password) {
  let readQuery = `SELECT ID FROM employee WHERE ID=?`;

  const [rows] = await conDB.execute(readQuery, [password]);
  const user=rows[0];
  ///בדיקת אימות
  if(!user){
    ////////שגיאה איך?
  }

  else{
    const token = jwt.sign({ userId: user.ID }, secretKey, { expiresIn: '1h' });
    return token;
  }
}

module.exports = LogIn;

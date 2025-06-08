const jwt = require("jsonwebtoken");
const conDB = require("../DataBase/tables/connectToDB");
const secretKey =
  process.env.JWT_SECRET || "Naomie&Perel@Schedule_project.2715.2969";

function verifyToken(req, res, next) {
  console.log("i am in verifyToken");
  // console.log(req.headers["authorization"]);

  const token = req.headers["authorization"]
    ? req.headers["authorization"].replace("Bearer ", "")
    : null;

  console.log("authHeader", token);

  if (!token) {
    console.log("if (!token) ");
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log("jwt.verify ok");

      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    console.log("decoded.userId", decoded.userId);
    console.log("decoded.role", decoded.role);
    req.userId = decoded.userId; // הוספת user לבקשה
    req.role = decoded.role; // הוספת user לבקשה
    next(); // מעבר לשלב הבא אם ה-token תקף
  });
}

const checkPermissions = (allowedRoles, action) => {
  return (req, res, next) => {
    console.log("checkPermissions", req.role);
    console.log("req.req.body.newSpe", req.body.newSpe);

    const userRole = req.role;
    // בדוק אם המשתמש יש לו את התפקיד הנדרש
    if (!allowedRoles.includes(userRole)) {
      console.log("Unauthorized to do this action", req.role, action);
      return res.status(403).json({ error: "Unauthorized to do this action" });
    }
    // אם המשתמש הוא מורה, בדוק האם הוא יכול לגשת לנתונים שקשורים רק אליו

    if (userRole === "Teacher" && action === "read") {
      //לביננתיים זה נכון אך בהמשך מורה תוכל
      console.log("teacher want to read  the employee with id: ", req.query.id);
      req.query.id = req.userId; ///לבדוק שהוא באמת מתעדכן
    }

    if (userRole === "Teacher" && action === "update") {
      // בדוק אם המשתמש מנסה לעדכן נתונים של עצמו בלבד
      console.log(
        "teacher want to update her details: ",
        req.body.employeeToUpdate.ID
      );
      const employeeId = req.body.employeeToUpdate.ID;
      if (employeeId !== req.userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this employee" });
      }
    }

    if (userRole === "Coordinator" && action === "update") {
      // בדוק אם המשתמש מנסה לעדכן נתונים של עצמו בלבד

      console.log("req.userId", req.userId);

      conDB.query(
        `SELECT EmpId FROM employee WHERE ID = ${req.userId} AND Role = 'Coordinator'`,
        (err, results) => {
          if (err) {
            console.error("Error checking coordinator:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (results.length === 0) {
            return res.status(403).json({ error: "User is not a coordinator" });
          }

          const empIdFromDB = results[0].EmpId;
          if (
            req.body.speToUpdate &&
            req.body.speToUpdate.EmpId !== empIdFromDB
          ) {
            return res.status(403).json({
              error:
                "Unauthorized to update another coordinator's specialization",
            });
          }

          // הכל תקין – ממשיכים
          return next();
        }
      );
      return;
    }
    next();
  };
};

module.exports = { verifyToken, checkPermissions };

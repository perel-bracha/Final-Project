const jwt = require("jsonwebtoken");
const secretKey =
  process.env.JWT_SECRET || "Naomie&Perel@Schedule_project.2715.2969";

function verifyToken(req, res, next) {
  console.log("i am in verifyToken");

  const token = req.headers["authorization"].replace("Bearer ", "");

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

    const userRole = req.role;
    // בדוק אם המשתמש יש לו את התפקיד הנדרש
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    // אם המשתמש הוא מורה, בדוק האם הוא יכול לגשת לנתונים שקשורים רק אליו

    if (userRole === "Teacher" && action === "read") {
      console.log("teacher want to read  the employee with id: " ,req.query.id);
      req.query.id = req.userId;///לבדוק שהוא באמת מתעדכן
    }
    if (userRole === "Teacher" && action === "update") {
      // בדוק אם המשתמש מנסה לעדכן נתונים של עצמו בלבד
      const employeeId = req.body.employeeToUpdate.id;
      if (employeeId !== req.userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this employee" });
      }
    }

    next();
  };
};

module.exports = { verifyToken, checkPermissions };

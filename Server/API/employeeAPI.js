//employeeAPI.js
const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const LogIn = require("../Services/LOG");
const app = Router();
const { verifyToken, checkPermissions } = require("./middlewares");

app.get("/", (req, res) => {
  return res.status(200).json("hello");
});

app.get(
  "/employees",
  verifyToken,
  checkPermissions(["Teacher", "Coordinator", "Admin"], "read"),
  (req, res) => {
    //החל ממורה- רק את עצמה , כל השאר כולם
    return Read(
      "employee",
      { id: req.query.id, speName: req.query.speName, login: req.query.login },
      callBack,
      res
    );
  }
);

app.post(
  "/employees",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "insert"),
  (req, res) => {
    //החל מרכזת
    // debugger;
    console.log(req.body.newEmployee, req.body);
    return Insert("employee", req.body.newEmployee, callBack, res);
  }
);

app.put(
  "/employees",
  verifyToken,
  checkPermissions(["Teacher", "Coordinator", "Admin"], "update"),
  (req, res) => {
    Update("employee", req.body.employeeToUpdate, callBack, res);
  }
);

app.delete(
  "/employees",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "delete"),
  (req, res) => {
    Delete("employee", "EmpId", req.query.id, callBack, res);
  }
);

app.post("/login", (req, res) => {
  //לא נתיב מוגן
  const empId = req.body.empId;
  const password = req.body.password;
  console.log("API: emp", empId);
  console.log("API: pass", password);

  LogIn(empId, password, (error, token) => {
    if (error) {
      console.error("Login error:", error.message);
      return res.status(404).json({ error: error.message });
    }
    console.log("chack sucsided", token);
    res.status(200).json({ token });
  });
});
module.exports = app;

//employeeAPI.js
const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const LogIn = require("../Services/LOGIN");
const app = Router();

app.get("/", (req, res) => {
  return res.status(200).json("hello");
});

app.get("/employees", (req, res) => {
  //Getting the employees
  // return  res.status(200).json("employees");

  return Read(
    "employee",
    { id: req.query.id, speName: req.query.speName, login: req.query.login },
    callBack,
    res
  );
});

app.post("/employees", (req, res) => {
  debugger
  console.log(`api ${req.body}`);
  return Insert("employee", req.body.newEmployee, callBack, res);
});

app.put("/employees", (req, res) => {
  Update("employee", req.body.employeeToUpdate, callBack, res);
});

app.delete("/employees", (req, res) => {
  Delete("employee", "EmpId", req.query.id, callBack, res);
});

app.post("/login", async (req, res) => {
  const password = req.body; //{ username, password }
  try {
    const token = await LogIn(password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = app;

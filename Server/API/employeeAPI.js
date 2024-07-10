const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const app = Router();

app.get("/", (req, res) => {
  return res.status(200).json("hello");
});

app.get("/employees", (req, res) => {
  //Getting the employees
  // return  res.status(200).json("employees");

  return Read(
    "employee",
    {id: req.query.id, speName: req.query.speName },
    callBack,
    res
  );
});

app.post("/employees", (req, res) => {
  // console.log(req.body);
  return Insert("employee", req.body.newEmployee, callBack, res);
});

app.put("/employees", (req, res) => {
  Update("employee", req.body.employeeToUpdate, callBack, res);
});

app.delete("/employees/:id", (req, res) => {
  Delete("employee", req.query.id, callBack, res);
});

module.exports = app;

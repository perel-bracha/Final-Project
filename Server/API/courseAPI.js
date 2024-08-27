const  Insert  = require("../Services/POST");
const Read  = require("../Services/GET");
const Update  = require("../Services/PUT");
const Delete  = require("../Services/DELETE");
const  callBack  = require("./callBack");
const { Router } = require("express");
const { verifyToken, checkPermissions } = require("./middlewares");

const app = Router();

app.get("/courses", (req, res) => {
  Read("course", { courseName: req.query.courseName }, callBack, res);
});

app.post("/courses", (req, res) => {
  Insert("course", req.body.newCourse, callBack, res);
});

app.put("/courses", (req, res) => {
  Update("course", req.body.courseToUpdate, callBack, res);
});

app.delete("/courses", (req, res) => {
  Delete("course", "CourseId", req.query.id, callBack, res);
});

module.exports = app;

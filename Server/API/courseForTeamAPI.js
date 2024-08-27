const  Insert  = require("../Services/POST");
const Read  = require("../Services/GET");
const Update  = require("../Services/PUT");
const Delete  = require("../Services/DELETE");
const  callBack  = require("./callBack");
const { Router } = require("express");
const { verifyToken, checkPermissions } = require("./middlewares");

const app = Router();

app.get("/courseForTeam", (req, res) => {
  Read(
    "courseForTeam",
    {
      speName: req.query.speName,
      startingStudiesYear: req.query.startingStudiesYear,
      semester: req.query.semester
    },// אולי להוסיף חיפוש על פי יחידה מסוימת 
    callBack, res
  );
});

app.post("/courseForTeam", (req, res) => {
  Insert("courseForTeam", req.body.newCFT, callBack, res);
});

app.put("/courseForTeam", (req, res) => {
  Update("courseForTeam", req.body.CTFToUpdate, callBack, res);
});

app.delete("/courseForTeam", (req, res) => {
  Delete("courseForTeam", "CTId", req.query.id, callBack, res);
});

module.exports = app;

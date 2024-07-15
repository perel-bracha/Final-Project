const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const app = Router();

app.get("/speces", (req, res) => {
  Read(
    "specialization",
    { speName: req.query.speName, empId: req.query.empId },
    callBack,
    res
  );
});

app.post("/speces", (req, res) => {
  Insert("specialization", req.body.newSpe, callBack, res);
});

app.put("/speces", (req, res) => {
  console.log("api" + req.body.speToUpdate.SpeId);
  Update("specialization", req.body.speToUpdate, callBack, res);
});

app.delete("/speces", (req, res) => {
  Delete("specialization", req.query.id, callBack, res);
});

module.exports = app;

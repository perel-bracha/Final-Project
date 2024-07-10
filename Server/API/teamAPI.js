const  Insert  = require("../Services/POST");
const Read  = require("../Services/GET");
const Update  = require("../Services/PUT");
const Delete  = require("../Services/DELETE");
const  callBack  = require("./callBack");
const { Router } = require("express");
const app = Router();

app.get("/teams", (req, res) => {
  Read(
    "team",
    {
      speName: req.query.speName,
      StartingStudiesYear: req.query.StartingStudiesYear,
    },
    callBack, res
  );
});

app.post("/teams", (req, res) => {
  Insert("team", req.body.newTeam, callBack, res);
});

app.put("/teams", (req, res) => {
  Update("team", req.body.teamToUpdate, callBack, res);
});

app.delete("/teams", (req, res) => {
  Delete("team", req.query.id, callBack, res);
});

module.exports = app;

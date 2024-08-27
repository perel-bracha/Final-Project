const  Insert  = require("../Services/POST");
const Read  = require("../Services/GET");
const Update  = require("../Services/PUT");
const Delete  = require("../Services/DELETE");
const  callBack  = require("./callBack");
const { Router } = require("express");
const { verifyToken, checkPermissions } = require("./middlewares");

const app = Router();

app.get("/teams", (req, res) => {
  Read(
    "team",
    {
      speName: req.query.speName,
      startingStudiesYear: req.query.startingStudiesYear,
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
  Delete("team", "TeamId", req.query.id, callBack, res);
});

module.exports = app;

const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const app = Router();

app.get("/schedules", (req, res) => {
  Read(
    "schedule",
    { unitId: req.query.unitId, day: req.query.day, teamId: req.query.teamId },
    callBack,
    res
  );
});

app.post("/schedules", (req, res) => {
  Insert("schedule", req.body.newSchedule, callBack, res);
});

app.put("/schedules", (req, res) => {
  Update("schedule", req.body.scheduleToUpdate, callBack, res);
});

app.delete("/schedules", (req, res) => {
  Delete("schedule", "SpeId", req.query.id, callBack, res);
});

module.exports = app;

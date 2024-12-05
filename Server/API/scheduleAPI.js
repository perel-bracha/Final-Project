const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { verifyToken, checkPermissions } = require("./middlewares");

const { Router } = require("express");
const app = Router();

app.get(
  "/schedules",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "read"),
  (req, res) => {
    Read(
      "schedule",
      {
        unitId: req.query.unitId,
        day: req.query.day,
        teamId: req.query.teamId,
        empId: req.query.empId
      },
      callBack,
      res
    );
  }
);

app.post(
  "/schedules",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "insert"),
  (req, res) => {
    Insert("schedule", req.body.newSchedule, callBack, res);
  }
);

app.put(
  "/schedules",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "update"),
  (req, res) => {
    Update("schedule", req.body.scheduleToUpdate, callBack, res);
  }
);

app.delete(
  "/schedules",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "delete"),
  (req, res) => {
    Delete("schedule", "SpeId", req.query.id, callBack, res);
  }
);

module.exports = app;

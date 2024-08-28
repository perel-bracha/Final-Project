const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const { verifyToken, checkPermissions } = require("./middlewares");

const app = Router();

app.get(
  "/teams",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "read"),
  (req, res) => {
    Read(
      "team",
      {
        speName: req.query.speName,
        startingStudiesYear: req.query.startingStudiesYear,
      },
      callBack,
      res
    );
  }
);

app.post(
  "/teams",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "insert"), //רכזת יכולה להוסיף קבוצות רק למגמה שלה
  (req, res) => {
    Insert("team", req.body.newTeam, callBack, res);
  }
);

app.put(
  "/teams",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "update"), //רכזת יכולה לעדכן רק קבוצות של המגמה שלה
  (req, res) => {
    Update("team", req.body.teamToUpdate, callBack, res);
  }
);

app.delete(
  "/teams",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "read"),
  (req, res) => {
    Delete("team", "TeamId", req.query.id, callBack, res);
  }
);

module.exports = app;

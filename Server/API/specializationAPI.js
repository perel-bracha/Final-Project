const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const { verifyToken, checkPermissions } = require("./middlewares");

const app = Router();

app.get(
  "/speces",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "read"),
  (req, res) => {
    Read(
      "specialization",
      { speName: req.query.speName, empId: req.query.empId },
      callBack,
      res
    );
  }
);

app.post(
  "/speces",
  verifyToken,
  checkPermissions(["Admin"], "insert"), //רק רכזת ראשית יכולה להוסיף מגמה חדשה
  (req, res) => {
    Insert("specialization", req.body.newSpe, callBack, res);
  }
);

app.put(
  "/speces",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "update"), //רכזת יכולה לעדכן רק את המגמה שלה
  (req, res) => {
    console.log("api" + req.body.speToUpdate.SpeId);
    Update("specialization", req.body.speToUpdate, callBack, res);
  }
);

app.delete("/speces",
  verifyToken,
  checkPermissions(["Admin"], "delete"),//רק רכזת הראשית יכלה למחוק מגמה
  (req, res) => {
  Delete("specialization", req.query.id, callBack, res);
});

module.exports = app;

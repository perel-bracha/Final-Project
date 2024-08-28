const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const { verifyToken, checkPermissions } = require("./middlewares");

const app = Router();

app.get(
  "/courseForTeam",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "read"), //בהמשך מורה כן תוכל לקרוא את הקורסים שהיא מלמדת
  (req, res) => {
    Read(
      "courseForTeam",
      {
        speName: req.query.speName,
        startingStudiesYear: req.query.startingStudiesYear,
        semester: req.query.semester,
      }, // אולי להוסיף חיפוש על פי יחידה מסוימת
      callBack,
      res
    );
  }
);

app.post(
  "/courseForTeam",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "insert"),
  (req, res) => {
    Insert("courseForTeam", req.body.newCFT, callBack, res);
  }
);

app.put(
  "/courseForTeam",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "update"),
  (req, res) => {
    Update("courseForTeam", req.body.CTFToUpdate, callBack, res);
  }
);

app.delete(
  "/courseForTeam",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "delete"),
  (req, res) => {
    Delete("courseForTeam", "CTId", req.query.id, callBack, res);
  }
);

module.exports = app;

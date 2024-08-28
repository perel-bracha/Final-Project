const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const { verifyToken, checkPermissions } = require("./middlewares");

const app = Router();

app.get(
  "/courses",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "read"), //בהמשך מורה כן תוכל לקרוא את הקורסים שהיא מלמדת
  (req, res) => {
    Read("course", { courseName: req.query.courseName }, callBack, res);
  }
);

app.post(
  "/courses",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "insert"),
  (req, res) => {
    Insert("course", req.body.newCourse, callBack, res);
  }
);

app.put(
  "/courses",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "update"),
  (req, res) => {
    Update("course", req.body.courseToUpdate, callBack, res);
  }
);

app.delete(
  "/courses",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "delete"),
  (req, res) => {
    Delete("course", "CourseId", req.query.id, callBack, res);
  }
);

module.exports = app;

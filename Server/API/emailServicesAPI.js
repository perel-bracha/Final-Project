const callBack = require("./callBack");
const { Router } = require("express");
const { verifyToken, checkPermissions } = require("./middlewares");
const Send = require("../Services/sendEmails");

const app = Router();

app.post(
  "/sendEmail",
  verifyToken,
  checkPermissions(["Coordinator", "Admin"], "send"),
  (req, res) => {
    console.log("req.body: " , req.body,"empId" ,req.body.empId);
    Send(req.body, callBack, res);
  }
);

// app.post(
//   "/sendEmailToAll",
//   verifyToken,
//   checkPermissions(["Coordinator", "Admin"], "send"),
//   (req, res) => {
//     console.log("req.body: " , req.body,"empId" ,req.body.empId);
//     SendAll(req.body, callBack, res);
//   }
// );

module.exports=app;
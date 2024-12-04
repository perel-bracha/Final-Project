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
    console.log(req.body, req.body.empId);
    
    Send(req.body.empId, callBack, res);
  }
);
module.exports=app;
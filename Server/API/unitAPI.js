const Insert = require("../Services/POST");
const Read = require("../Services/GET");
const Update = require("../Services/PUT");
const Delete = require("../Services/DELETE");
const callBack = require("./callBack");
const { Router } = require("express");
const { verifyToken, checkPermissions } = require("./middlewares");

const app = Router();

app.get("/units", (req, res) => {
  Read("unit", { UnitId: req.query.UnitId }, callBack, res);
});

app.post("/units", (req, res) => {
  Insert("unit", req.body.newUnit, callBack, res);
});

app.put("/units", (req, res) => {
  Update("unit", req.body.unitToUpdate, callBack, res);
});

app.delete("/units", (req, res) => {
  Delete("unit", "UnitId", req.query.id, callBack, res);
});

module.exports = app;

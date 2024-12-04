//express.js

const cors = require("cors");
const myExpress = require("express");
// const jwt = require("jsonwebtoken");
const app = myExpress();
const port = 8000;

const courseApi = require("../API/courseAPI");
const courseForTeamApi = require("../API/courseForTeamAPI");
const employeeApi = require("../API/employeeAPI");
const scheduleApi = require("../API/scheduleAPI");
const specializationApi = require("../API/specializationAPI");
const teamApi = require("../API/teamAPI");
const unitApi = require("../API/unitAPI");
const emailServicesApi=require("../API/emailServicesAPI");

app.use(cors()); // Use this after the variable declaration

app.use(myExpress.json());
// app.use(cors());//{origin: 'http://localhost:3000'}
app.use(courseApi);
app.use(courseForTeamApi);
app.use(employeeApi);
app.use(scheduleApi);
app.use(specializationApi);
app.use(teamApi);
app.use(unitApi);
app.use(emailServicesApi);



app.get("", (req, res) => {
  return res.status(200).json("Scheduled Project");
});

app.listen(port, () => {
  console.log(`Server is runing on http://localhost:${port}`);
});

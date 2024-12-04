const nodemailer = require("nodemailer");
const conDB = require("../DataBase/tables/connectToDB");
const Read = require("./GET");

async function sendEmail(empId, callBack, resToCallBack) {
  // הגדרת פרטי השרת (SMTP)
  // const scheduledList = Read(
  //   "schedule",
  //   { empId: body.empId },
  //   callBack,
  //   resToCallBack //נכון לשלוח אותו?
  // );
  // const scheduledList = conDB.query(
  //   `SELEST * FROM schedule WHERE ${body.empId}=(SELECT EmpId FROM courseForTeam ct WHERE ct.CTId=s.CTId)`,
  //   (error, result) => {
  //     if (error) return callBack(error);
  //     return result;
  //   }
  // );
  // const to = conDB.query(
  //   `SELECT Email FROM employee WHERE EmpId=${body.empId}`,
  //   (error, result) => {
  //     if (error) return callBack(error);
  //     return result;
  //   }
  // );
  try {
    const [scheduledList] = await conDB
      .promise()
      .query(
        `SELECT * FROM schedule s WHERE ${empId}=(SELECT EmpId FROM courseForTeam ct WHERE ct.CTId=s.CTId)`
      );
    const [emailResult] = await conDB
      .promise()
      .query(`SELECT Email FROM employee WHERE EmpId=${empId}`);
  } catch (error) {
    return callBack(error, null, resToCallBack);
  }

  // קריאת כתובת האימייל של העובד

  if (!emailResult.length) {
    return callBack(new Error("No email address found."), null, resToCallBack);
  }

  const to = emailResult[0].Email;

  // הגדרת פרטי המייל
  const text = JSON.stringify(scheduledList, null, 2);
  const subject = "מערכת אישית לסמסטר זה"; //צריך לקרוא סמסטר באיזושהי צורה
  const transporter = nodemailer.createTransport({
    service: "gmail", // לדוגמה, משתמש ב-Gmail, אך אפשר להגדיר שרת אחר
    auth: {
      user: "scheduleofakim@gmail.com",
      pass: "jitm hbte xmzi rghl",
    },
  });

  const mailOptions = {
    from: "scheduleofakim@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail;

// sendEmail(
//   "pn0556781949@gmail.com",
//   "This email sent from the schedule ap",
//   "בסוף יהיה טוב וכבר עכשיו טוב"
// );
//בשליחת אימייל משותף בדרך כלל לפי מגמה או לכל המורות לפי סמסטר ואז צריך לקרוא רשימה של המורות הכלולות ולכל אחת לבצע שליחת מייל אישי
//בשליחת מייל אישי אמורים לקבל פרטי מורה ואת כל השאר לקרוא לבד
//הקריאות מהשרת: קריאת מייל המורה, קריאת מערכת המורה
//בשליחה מרוכזת קריאת כל המורות
//שליחת קישור לעדכון פרטים

const nodemailer = require("nodemailer");
const conDB = require("../DataBase/tables/connectToDB");
const Read = require("./GET");

async function sendEmail(data, callBack, resToCallBack) {
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
  console.log(`at send email. empId: ${data.empId}`);

  // if (!data.empId || typeof empId !== "number") {
  //   return callBack(new Error("Invalid empId."), null, resToCallBack);
  // }
  try {
    let text = "";
    let subject = "";
    const [emailResult] = await conDB
      .promise()
      .query(`SELECT Email FROM employee WHERE EmpId=?`, [data.empId]);
    console.log(emailResult);

    if (!emailResult.length) {
      return callBack(
        new Error("No email address found."),
        null,
        resToCallBack
      );
    }
    const to = emailResult[0].Email;
    if (data.subject == "schedule") {
      const [scheduledList] = await conDB
        .promise()
        .query(
          `SELECT * FROM schedule s WHERE ?=(SELECT EmpId FROM courseForTeam ct WHERE ct.CTId=s.CTId)`,
          [data.empId]
        );
      text = formatScheduleAsTable(scheduledList);
      subject = "מערכת אישית לסמסטר זה"; //צריך לקרוא סמסטר באיזושהי צורה
    } else if (data.subject == "welcome") {
      text =
        "הוספת כמורה באתר המערכת של סמינר אופקים. קישור לאתר מצורף למטה. אנא כנסי בהקדם לצורך השלמת פרטייך. הכניסה באמצעות שם משתמש- תעודת הזהות שלך.";
      subject = "מערכת סמינר אופקים";
    }

    // הגדרת פרטי המייל
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
      html: text,
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
      callBack(null, result, resToCallBack);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  } catch (error) {
    return callBack(error, null, resToCallBack);
  }

  // קריאת כתובת האימייל של העובד
}

module.exports = sendEmail;

function formatScheduleAsTable(scheduleArray) {
  // ימים אפשריים
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];
  // מציאת יחידות ייחודיות
  const units = [0,1,2,3];//...new Set(scheduleArray.map((entry) => entry.UnitId)).sort()
//לכאורה צריך להיות גלובלי
  // בניית כותרת הטבלה
  let tableHtml = `
    <div style="direction: rtl; text-align: right;">
      <h3>מערכת שעות אישית למורה</h3>
      <table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
        <thead>
          <tr>
            <th>יחידה / יום</th>
            ${days.map((day) => `<th>${day}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
  `;

  // בניית שורות הטבלה
  units.forEach((unit) => {
    tableHtml += `<tr><td>יחידה ${unit}</td>`;
    days.forEach((day) => {
      // מציאת כל השיעורים המתאימים לאותו יום ויחידה
      const lessons = scheduleArray.filter(
        (entry) => entry.Day === day && entry.UnitId === unit
      );
      if (lessons.length > 0) {
        // הכנסת מידע לתא
        tableHtml += `<td>${lessons
          .map(
            (lesson) =>
              `שעות: ${lesson.BeginningTime} - ${lesson.EndTime}<br>קורס: ${lesson.CTId}`
          )
          .join("<br>")}</td>`;
      } else {
        tableHtml += "<td>—</td>"; // אם אין שיעורים
      }
    });
    tableHtml += "</tr>";
  });

  // סגירת הטבלה
  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  return tableHtml;
}


// function formatScheduleAsTable(scheduleArray) {
//   // כותרת
//   let tableHtml = `
//     <div style="direction: rtl; text-align: right;">
//       <h3>מערכת שעות אישית למורה</h3>
//       <table border="1" style="border-collapse: collapse; width: 100%; text-align: right;">
//         <thead>
//           <tr>
//             <th>יום</th>
//             <th>שעת התחלה</th>
//             <th>שעת סיום</th>
//             <th>יחידה</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;

//   // שורות הטבלה
//   scheduleArray.forEach((entry) => {
//     tableHtml += `
//       <tr>
//         <td>${entry.Day}</td>
//         <td>${entry.BeginningTime}</td>
//         <td>${entry.EndTime}</td>
//         <td>יחידה ${entry.UnitId}</td>
//       </tr>
//     `;
//   });

//   // סגירת טבלה
//   tableHtml += `
//         </tbody>
//       </table>
//     </div>
//   `;

//   return tableHtml;
// }

// function formatScheduleAsTable(scheduleArray) {
//   // כותרת הטבלה
//   let tableText = "מערכת שעות אישית למורה:\n\n";
//   tableText += "יום       | שעת התחלה | שעת סיום  | יחידה\n";
//   tableText += "------------------------------------------\n";

//   // הוספת השורות לטבלה
//   scheduleArray.forEach((entry) => {
//     const day = entry.Day.padEnd(10, " "); // ריווח לימין
//     const beginningTime = entry.BeginningTime.padEnd(11, " ");
//     const endTime = entry.EndTime.padEnd(10, " ");
//     const unit = `יחידה ${entry.UnitId}`;

//     tableText += `${day}| ${beginningTime}| ${endTime}| ${unit}\n`;
//   });
//   console.log(tableText);

//   return tableText;
// }

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

const nodemailer=require("nodemailer");

async function sendEmail(to, subject, text) {
    // הגדרת פרטי השרת (SMTP)
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

  sendEmail("pn0556781949@gmail.com", "This email sent from the schedule ap", "בסוף יהיה טוב וכבר עכשיו טוב");
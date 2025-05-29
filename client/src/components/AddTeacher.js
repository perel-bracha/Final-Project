import React, { useState } from "react";
import { Insert } from "../fetch";
import { Employee } from "../objects/employeeObj";
import "../pages/styles/style.css";

function AddTeacher() {
  const [formData, setFormData] = useState(new Employee());

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      console.log(formData);
      // פונקציה ליצירת סיסמה חזקה//
      //crypto.randomBytes(4).toString("hex");
      const pass = ""; //////
      const res = await Insert(`/employees`, { newEmployee: formData });
      console.log(res);
      //שליחת מייל ברוכה הבאה
      Insert(`/sendEmail`, { empId: res, subject: "welcome", pass: pass })
        .then((res) => res.json)
        .then((emailadd) => alert(`מייל צרוף נשלח בהצלחה לכתובת ${emailadd}.`))
        .catch((error) => {
          console.error("Error: ", error);
          alert("⚠️ .אירעה שגיאה במהלך שליחת המייל למורה. המייל לא נשלח.");
        });

      setFormData(new Employee());
    } catch (error) {
      console.error("Error: ", error);
      alert("⚠️ .אירעה שגיאה במהלך הוספת המורה. המורה לא הוספה.");
    }
  };

  return (
    <div className="addTeacher">
      <h1>הוספת מורה </h1>

      <form onSubmit={handleSubmit}>
        <label>
          שם פרטי:
          <input
            type="text"
            name="firstName"
            value={formData.FirstName}
            onChange={(e) => {
              setFormData({ ...formData, FirstName: e.target.value });
              console.log(formData);
            }}
            required
          />
        </label>
        <br />
        <label>
          שם משפחה:
          <input
            type="text"
            name="lastName"
            value={formData.LastName}
            onChange={(e) => {
              setFormData({ ...formData, LastName: e.target.value });
            }}
            required
          />
        </label>
        <br />
        <label>
          מספר זהות:
          <input
            type="text"
            name="idNumber"
            value={formData.ID}
            onChange={(e) => {
              setFormData({ ...formData, ID: e.target.value });
            }}
            required
          />
        </label>

        <br />
        <label>
          מייל
          <input
            type="email"
            name="email"
            value={formData.Email}
            onChange={(e) => {
              setFormData({ ...formData, Email: e.target.value });
            }}
            required
          />
        </label>
        <button type="submit">שלח</button>
      </form>
    </div>
  );
}

export default AddTeacher;

// setFormData({
//   EmpId: 0,
//   ID: "342582715",
//   FirstName: "לאה",
//   LastName: "גרונשטיין",
//   Email: "",
//   PhoneNumber1: "",
//   PhoneNumber2: "",
//   City: "",
//   Street: "",
//   HouseNumber: "",
//   ZipCode: "",
// });

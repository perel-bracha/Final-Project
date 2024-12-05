import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/style.css";
import { Update } from "../fetch";
import { Employee } from "../objects/employeeObj";
import Entry from "../components/Entry";

//שינוי סיסמא
//אימות זהות LOG
//לשמור את הסיסמא עם hash

export default function TeacherForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const emp = location.state ? location.state.emp : new Employee();
  console.log(emp);
  const [formData, setFormData] = useState(emp);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // מצב להצגת הסיסמה
  const [error, setError] = useState(""); // משתנה לאחסון הודעות שגיאה
  const [showIdentityVerification, setIdentityVerification] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // const handleWeekdaysPreferenceChange = (e) => {
  //   const { value } = e.target;
  //   const updatedWeekdays = [...formData.WeekdaysPreference];
  //   if (updatedWeekdays.includes(value)) {
  //     updatedWeekdays.splice(updatedWeekdays.indexOf(value), 1);
  //   } else {
  //     updatedWeekdays.push(value);
  //   }
  //   setFormData({ ...formData, WeekdaysPreference: updatedWeekdays });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await Update(`/employees/?id=${formData.EmpId}`, {
        employeeToUpdate: formData,
      });
      navigate("/hello", { state: { emp: formData } });
      // navigate(-1);
    } catch (error) {
      console.error("Error during updaing:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      alert(errorMessage);
    }
  };
 const loginVerification=(token)=>{
  
  setShowPasswordModal(true)
 }
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("הסיסמאות אינן תואמות");
      return;
    }
    try {
      emp.password_hash = passwordData.newPassword;
      await Update(`/employees/?id=${formData.EmpId}`, {
        employeeToUpdate: emp,
      });
      alert("הסיסמה עודכנה בהצלחה");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Error during password change:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      alert(errorMessage);
    }
  };

  return (
    <>
      <h1>פרטים אישיים:</h1>
      <form className="home" onSubmit={handleSubmit}>
        <input
          type="text"
          name="ID"
          placeholder="ID"
          value={formData.ID}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="FirstName"
          placeholder="First Name"
          value={formData.FirstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="LastName"
          placeholder="Last Name"
          value={formData.LastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="PhoneNumber1"
          placeholder="Phone Number 1"
          value={formData.PhoneNumber1}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="PhoneNumber2"
          placeholder="Phone Number 2"
          value={formData.PhoneNumber2}
          onChange={handleChange}
        />
        <input
          type="text"
          name="City"
          placeholder="City"
          value={formData.City}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Street"
          placeholder="Street"
          value={formData.Street}
          onChange={handleChange}
        />
        <input
          type="text"
          name="HouseNumber"
          placeholder="House Number"
          value={formData.HouseNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ZipCode"
          placeholder="Zip Code"
          value={formData.ZipCode}
          onChange={handleChange}
        />
        <br />

        <button type="button" onClick={() => setIdentityVerification(true)}>
          שנה סיסמה
        </button>
        <br />
        <button type="submit">עדכן</button>
      </form>

      {showIdentityVerification && <Entry loginVerification={loginVerification} showEntry={setIdentityVerification}/>}

      {showPasswordModal && (
        <div className="password-modal">
          <form onSubmit={handlePasswordSubmit}>
            <h2>שינוי סיסמה</h2>
            <input
              type="password"
              name="newPassword"
              placeholder="סיסמה חדשה"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="אימות סיסמה"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            <button type="submit">שנה סיסמה</button>
            <button type="button" onClick={() => setShowPasswordModal(false)}>
              ביטול
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// ID: "",
//     FirstName: "",
//     LastName: "",
//     Email: "",
//     PhoneNumber1: "",
//     PhoneNumber2: "",
//     City: "",
//     Street: "",
//     HouseNumber: "",
//     ZipCode: "",
//     WeekdaysPreference: [],

///בחירת ימי העדפה
{
  /* <label>Weekdays Preference:</label>
        <div>
          <label>
            <input
              type="checkbox"
              name="Sunday"
              value="Sunday"
              onChange={handleWeekdaysPreferenceChange}
            />
            Sunday
          </label>
          <label>
            <input
              type="checkbox"
              name="Monday"
              value="Monday"
              onChange={handleWeekdaysPreferenceChange}
            />
            Monday
          </label>
          <label>
            <input
              type="checkbox"
              name="Tuesday"
              value="Tuesday"
              onChange={handleWeekdaysPreferenceChange}
            />
            Tuesday
          </label>
          <label>
            <input
              type="checkbox"
              name="Wednesday"
              value="Wednesday"
              onChange={handleWeekdaysPreferenceChange}
            />
            Wednesday
          </label>
          <label>
            <input
              type="checkbox"
              name="Thursday"
              value="Thursday"
              onChange={handleWeekdaysPreferenceChange}
            />
            Thursday
          </label>
          <label>
            <input
              type="checkbox"
              name="Friday"
              value="Friday"
              onChange={handleWeekdaysPreferenceChange}
            />
            Friday
          </label>
        </div> */
}

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/style.css";
import { Update } from "../fetch";
import { Employee } from "../objects/employeeObj";

export default function TeacherForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const emp = location.state ? location.state.emp : "";
  console.log(emp);
  const [formData, setFormData] = useState(emp);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const res = await Update(`/employees/?id=${formData.EmpId}`, {
        employeeToUpdate: formData,
      });
      setFormData(new Employee());
      navigate(-1)
    } catch (error) {
      console.error("Error during updaing:", error);
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
        <label>Weekdays Preference:</label>
        {/* <div>
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
        </div> */}
        <button type="submit">Submit</button>
      </form>
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

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Insert, Read, Update } from "../fetch";
import { Specialization } from "../objects/specializationObj";

export default function AddUpdateSpe() {
  //בעדכון של פרטי מגמה נוכחית צריך להביא גם את הקבוצה הנוכחית לעדכון
  //כי הרכזת נמצאת בעמוד של קבוצה מסויימת
  const location = useLocation();
  const navigate = useNavigate();
  const currentEmp = JSON.parse(localStorage.getItem("userInfo"));
  const addUpdateStatus = location.state ? location.state.addUpdateStatus : " ";
  const speObj = location.state ? location.state.speObj : new Specialization();
  console.log("speObj", speObj);
  let update = true; //מצב ADD או UPDATE?
  let title = addUpdateStatus;
  if (addUpdateStatus == "הוספה") {
    title = "הוספת";
    update = false;
  }

  const [formData, setFormData] = useState(speObj);
  const [firstReadEmps, setFirstReadEmps] = useState(true);
  const [employees, setEmployees] = useState([]);
  console.log(formData);

  useEffect(() => {
    if (firstReadEmps) {
      readEmployees();
    }
  }, [firstReadEmps]); // useEffect יקרא ל- readEmployees פעם אחת בהתחלה, כאשר firstReadEmps משתנה

  const readEmployees = async () => {
    try {
      const res = await Read("/employees"); //לעשות שיהיה בשרת אופציה
      setEmployees(res); // קבלת רשימת המורים מהשרת והצגתם ברשימה
      setFirstReadEmps(false);
      if (!update) setFormData({ ...formData, EmpId: res[0].EmpId }); // איפוס הנתונים של המורה
    } catch (error) {
      console.error("Error: ", error);
    }
    // return employees;//אולי בגלל זה יכולה להיות בעיה
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //`כאן תתבצע הטיפול בשליחת הנתונים לשרת להוספה או עדכון
    try {
      if (update) {
        console.log(formData);
        await Update(`/speces`, { speToUpdate: formData }); // const res =
      } else {
        await Insert(`/speces`, { newSpe: formData }); // const res =
      }
      //   alert("המגמה נוספה בהצלחה");
      // setFormData(new Specialization()); // לאחר שהנתונים נשלחו בהצלחה, ניתן לאפס את הטופס
      navigate(-1);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="addUpdateSpe">
      <form onSubmit={handleSubmit}>
        <h2>{title} מגמה</h2>
        <div>
          <label>שם מגמה:</label>
          <input
            type="text"
            value={formData.SpeName}
            onChange={(e) =>
              setFormData({ ...formData, SpeName: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>קוד מגמה:</label>
          <input type="text" value={formData.SpeId} readOnly />
        </div>

        <div>
          <label>רכזת:</label>
          <select
            value={formData.EmpId}
            onChange={(e) =>
              setFormData({ ...formData, EmpId: Number(e.target.value) })
            }
            required
          >
            {currentEmp.Role == "Admin" ? (
              employees.map((emp, index) => (
                <option
                  key={index}
                  value={emp.EmpId}
                >{`${emp.FirstName} ${emp.LastName}`}</option>
              ))
            ) : (
              <option value={currentEmp.EmpId}>
                {`${currentEmp.FirstName} ${currentEmp.LastName}`}
              </option>
            )}
          </select>
        </div>

        <button type="submit">{addUpdateStatus}</button>
      </form>
    </div>
  );
}

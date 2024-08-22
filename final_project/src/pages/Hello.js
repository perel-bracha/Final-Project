// import React, { useEffect, useState } from "react";
// import "./styles/style.css";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Read } from "../fetch";
// import { Employee } from "../objects/employeeObj";

// export default function Hello() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const emp = location.state ? location.state.emp : new Employee(); // אם location.state אינו מוגדר, הצב ערך ברירת מחדל

//   console.log("Employee:", emp);
//   const [currentEmp, setCurrentEmp] = useState(emp);
//   const [mySpe, setMySpe] = useState([]);

//   useEffect(() => {
//     console.log("Fetching specializations for empId:", currentEmp.EmpId);
//     Read(`/speces/?empId=${currentEmp.EmpId}`).then((speRes) => {
//       console.log("Specializations response:", speRes);
//       //אין מקרה שעובד ייכנס לעמוד הזה בלי שתהיה לו מגמה
//       if (speRes.length !== 0) {
//         setMySpe(speRes);
//         console.log("Updated mySpe:", speRes);
//       }
//     });
//   }, [currentEmp.EmpId]);

//   const getGreeting = () => {
//     const currentHour = new Date().getHours();

//     if (currentHour >= 6 && currentHour < 12) {
//       return "בוקר טוב";
//     } else if (currentHour >= 12 && currentHour < 18) {
//       return "צהריים טובים";
//     } else if (currentHour >= 18 && currentHour < 21) {
//       return "ערב טוב";
//     } else {
//       return "לילה טוב";
//     }
//   };

//   return (
//     <div>
//       <h1>
//         {`!${getGreeting()} ${currentEmp.FirstName} ${currentEmp.LastName}`}
//       </h1>

//       <button
//         onClick={() => navigate("teacher", { state: { emp: currentEmp } })} // שליחת עובד
//       >
//         עדכון פרטים אישיים
//       </button>

//       {mySpe.length === 0 ? (
//         <p>Loading specializations...</p>
//       ) : (
//         mySpe.map((spe, index) => (
//           <button
//             key={index}
//             onClick={() => {
//               navigate("home", { state: { spe: spe } });
//             }}
//           >
//             {spe.SpeName}
//           </button>

//         ))
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import "./styles/style.css";
import {
  useLocation,
  useNavigate,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import { Read } from "../fetch";
import { Employee } from "../objects/employeeObj";
import Home from "./Home";
import AddTeacher from "../components/AddTeacher";
import AddUpdateSpe from "../components/AddUpdateSpe";
import AddCourse from "../components/AddCourse";
import AddTeam from "../components/AddTeam";

export default function Hello() {
  const location = useLocation();
  const navigate = useNavigate();
  const { speId } = useParams();
  // const emp = location.state ? location.state.emp : new Employee(); // אם location.state אינו מוגדר, הצב ערך ברירת מחדל
  const empId = location.state ? location.state.emp.EmpId : null;

  console.log("Employee:", empId);

  // const [currentEmp, setCurrentEmp] = useState(emp);
  const [currentEmp, setCurrentEmp] = useState(
    location.state ? location.state.emp : new Employee()
  );

  const [mySpe, setMySpe] = useState([]);
  const [activeSpe, setActiveSpe] = useState(null);

  useEffect(() => {
    const fetchUpdatedEmp = async () => {
      if (empId) {
        const updatedEmp = await Read(`/employees/${empId}`);
        setCurrentEmp(updatedEmp);
      }
    };
    fetchUpdatedEmp();
  }, [empId, navigate]);

  useEffect(() => {

    console.log("Fetching specializations for empId:", currentEmp.EmpId);

    Read(`/speces/?empId=${currentEmp.EmpId}`).then((speRes) => {
      console.log("Specializations response:", speRes);
      if (speRes.length !== 0) {
        setMySpe(speRes);

        const initialSpe =
          speRes.find((spe) => spe.SpeId.toString() === speId) || speRes[0];
        setActiveSpe(initialSpe);
        // if (!speId || !speRes.some(spe => spe.SpeId.toString() === speId)) {
        //   navigate(`/hello/${initialSpe.SpeId}`);
        // }
      }
    });
  }, [currentEmp.EmpId, speId]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) return "בוקר טוב";
    if (currentHour >= 12 && currentHour < 18) return "צהריים טובים";
    if (currentHour >= 18 && currentHour < 21) return "ערב טוב";
    return "לילה טוב";
  };

  return (
    <div>
      <h1>
        {`!${getGreeting()} ${currentEmp.FirstName} ${currentEmp.LastName}`}
      </h1>

      <button
        onClick={() => navigate("/teacher", { state: { emp: currentEmp } })} // שליחת עובד
      >
        עדכון פרטים אישיים
      </button>

      <div className="tabs">
        {mySpe.map((spe) => (
          <button
            key={spe.SpeId}
            className={`tab ${
              activeSpe && activeSpe.SpeId === spe.SpeId ? "active" : ""
            }`}
            onClick={() => navigate(`/hello/${spe.SpeId}`)}
          >
            {spe.SpeName}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <Routes>
          <Route
            path=":speId"
            element={<Home spe={activeSpe} emp={currentEmp} />}
          />
          <Route path=":speId/addTeacher" element={<AddTeacher />} />
          <Route path=":speId/addSpe" element={<AddUpdateSpe />} />
          <Route path=":speId/addCourse" element={<AddCourse />} />
          <Route path=":speId/addTeam" element={<AddTeam />} />
        </Routes>
      </div>
    </div>
  );
}

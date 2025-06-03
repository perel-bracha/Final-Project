import React, { useEffect, useState } from "react";
import "../styles/tabsAndButtonsDesign.css";
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
import { List } from "./List";

export default function Hello() {
  const location = useLocation();
  const navigate = useNavigate();
  const { speId } = useParams();
  // const emp = location.state ? location.state.emp : new Employee(); // אם location.state אינו מוגדר, הצב ערך ברירת מחדל
  const emp = location.state ? location.state.emp : new Employee();
  const [currentEmp, setCurrentEmp] = useState(emp);
  // if (emp) localStorage.setItem("currentEmp", JSON.stringify(emp));
  // else {
  //   const storedEmp = localStorage.getItem("currentEmp");
  //   if (storedEmp) {
  //     setCurrentEmp(JSON.parse(storedEmp));
  //   }
  // }

  console.log("Employee:", currentEmp);

  const [mySpe, setMySpe] = useState([]);
  const [activeSpe, setActiveSpe] = useState(null);

  useEffect(() => {
    console.log("Fetching specializations for empId:", currentEmp.EmpId);
    let readSpeces=(currentEmp.Role=="Admin")? `/speces`:`/speces/?empId=${currentEmp.EmpId}`;
    Read(readSpeces).then((speRes) => {
      console.log("Specializations response:", speRes);
      if (speRes.length !== 0) {
        setMySpe(speRes);
        const initialSpe =
          speRes.find((spe) => spe.SpeId.toString() === speId) || speRes[0];
        setActiveSpe(initialSpe);
      }
    });
  }, [currentEmp.EmpId, speId]);

  useEffect(() => {
    if (activeSpe && activeSpe.SpeId !== speId) {
      navigate(`/hello/${activeSpe.SpeId}`);
    }
  }, [activeSpe, speId]);

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
        <button
          onClick={() => navigate("/teacher", { state: { emp: currentEmp } })} // שליחת עובד
        >
          עדכון פרטים אישיים
        </button>

        {`!${getGreeting()} ${currentEmp.FirstName} ${currentEmp.LastName}`}
      </h1>

      <div className="tabs">
        {mySpe.map((spe) => (
          <button
            key={spe.SpeId}
            className={`tab-button ${
              activeSpe && activeSpe.SpeId === spe.SpeId ? "active" : ""
            }`}
            onClick={() => {
              setActiveSpe(spe);
            }}
          >
            {spe.SpeName}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <Routes>
          <Route
            path=":speId"
            element={
              <Home spe={activeSpe} emp={currentEmp} key={activeSpe?.SpeId} />
            }
          />
          <Route path=":speId/addTeacher" element={<AddTeacher />} />
          <Route path=":speId/addSpe" element={<AddUpdateSpe />} />
          <Route path=":speId/addCourse" element={<AddCourse />} />
          <Route path=":speId/addTeam" element={<AddTeam spe={activeSpe} />} />
          <Route
            path=":speId/:speName/teachers"
            element={<List whatToShow={"employees"} />}
          />
          <Route
            path=":speId/:speName/courses"
            element={<List whatToShow={"courseForTeam"} />}
          />
        </Routes>
      </div>
    </div>
  );
}

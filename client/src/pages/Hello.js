import { useEffect, useState } from "react";
import "../styles/hello.css";
import "../styles/style.css";
import { useNavigate, Routes, Route, useParams } from "react-router-dom";
import { Read } from "../fetch";
import Home from "./Home";
import AddTeacher from "../components/AddTeacher";
import AddUpdateSpe from "../components/AddUpdateSpe";
import AddCourse from "../components/AddCourse";
import AddTeam from "../components/AddTeam";
import { List } from "./List";
import TeacherSchedule from "../components/TeacherSchedule";
import TeacherForm from "./TeacherForm";

console.log("employee:", JSON.parse(localStorage.getItem("userInfo")));

export default function Hello() {
  const navigate = useNavigate();
  const { speId } = useParams();

  const [currentEmp, setCurrentEmp] = useState();
  const [mySpe, setMySpe] = useState([]);
  const [activeSpe, setActiveSpe] = useState(null);

  useEffect(() => {
    setCurrentEmp(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  useEffect(() => {
    if (!currentEmp) return;
    if (currentEmp.Role == "Teacher") return;
    let readSpeces =
      currentEmp.Role == "Admin"
        ? `/speces`
        : `/speces/?empId=${currentEmp.EmpId}`;
    Read(readSpeces).then((speRes) => {
      console.log("Specializations response:", speRes);
      if (speRes.length !== 0) {
        setMySpe(speRes);
        const initialSpe =
          speRes.find((spe) => spe.SpeId.toString() === speId) || speRes[0];
        setActiveSpe(initialSpe);
      }
    });
  }, [currentEmp, speId]);

  useEffect(() => {
    if (activeSpe && activeSpe.SpeId !== speId) {
      navigate(`/hello/${activeSpe.SpeId}`);
    }
  }, [activeSpe, speId]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) return "בוקר טוב";
    if (currentHour >= 12 && currentHour < 18) return "צהריים טובים";
    if (currentHour >= 18 && currentHour < 20) return "ערב טוב";
    return "לילה טוב";
  };
  console.log("currentEmp:", currentEmp);

  const renderTabs = () => (
    <div className="tabs">
      {mySpe.map((spe) => (
        <button
          key={spe.SpeId}
          className={`tab-button ${
            activeSpe?.SpeId === spe.SpeId ? "active" : ""
          }`}
          onClick={() => {
            setActiveSpe(spe);
          }}
        >
          {spe.SpeName}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {currentEmp && (
        <div className="main-title">
          <div className="left-section">
            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userInfo");
                localStorage.removeItem("currentSpe");
                navigate("/");
              }}
            >
              LogOut
            </button>
            <button
              onClick={() =>
                navigate(`/hello/${activeSpe ? activeSpe.SpeId : ""}`)
              }
            >
              home
            </button>
          </div>

          <div className="center-section">
            <h2 className="greeting-text">
              {`!${getGreeting()} ${currentEmp.FirstName} ${
                currentEmp.LastName
              }`}
            </h2>
          </div>

          <div className="right-section">
            <button onClick={() => navigate("/hello/personal-details")}>
              עדכון פרטים
            </button>

            <button onClick={() => navigate("/hello/teacher-schedule")}>
              מערכת אישית
            </button>
          </div>
        </div>
      )}

      <Routes>
        {currentEmp && currentEmp.Role === "Teacher" && (
          <>
            <Route
              path="teacher-schedule"
              element={<TeacherSchedule empId={currentEmp.EmpId} />}
            />
            <Route
              path="personal-details"
              element={<TeacherForm emp={currentEmp} />}
            />
            <Route
              path="*"
              element={<TeacherSchedule empId={currentEmp.EmpId} />}
            />
          </>
        )}

        {currentEmp && currentEmp.Role !== "Teacher" && (
          <>
            <Route
              path="home"
              element={
                <>
                  <div className="tabs">
                    {mySpe.map((spe) => (
                      <button
                        key={spe.SpeId}
                        className={`tab-button ${
                          activeSpe && activeSpe.SpeId === spe.SpeId
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveSpe(spe);
                          // navigate(`/hello/home`);
                        }}
                      >
                        {spe.SpeName}
                      </button>
                    ))}
                  </div>
                  <Home spe={activeSpe} />
                </>
              }
            />

            <Route
              path="personal-details"
              element={<TeacherForm emp={currentEmp} />}
            />
            <Route
              path="teacher-schedule"
              element={<TeacherSchedule empId={currentEmp.EmpId} />}
            />
            <Route
              path="addTeacher"
              element={
                <>
                  {renderTabs()}
                  <AddTeacher />
                </>
              }
            />
            <Route
              path="addSpe"
              element={
                <>
                  {renderTabs()}
                  <AddUpdateSpe />
                </>
              }
            />
            <Route
              path="addCourse"
              element={
                <>
                  {renderTabs()}
                  <AddCourse />
                </>
              }
            />
            <Route
              path="addTeam"
              element={
                <>
                  {renderTabs()}
                  <AddTeam spe={activeSpe} />
                </>
              }
            />
            <Route
              path=":speName/teachers"
              element={
                <>
                  {renderTabs()}
                  <List whatToShow={"employees"} />
                </>
              }
            />
            <Route
              path=":speName/courses"
              element={
                <>
                  {renderTabs()}
                  <List whatToShow={"courseForTeam"} />
                </>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <div className="tabs">
                    {mySpe.map((spe) => (
                      <button
                        key={spe.SpeId}
                        className={`tab-button ${
                          activeSpe?.SpeId === spe.SpeId ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveSpe(spe);
                        }}
                      >
                        {spe.SpeName}
                      </button>
                    ))}
                  </div>
                  <Home spe={activeSpe} />
                </>
              }
            />
          </>
        )}
      </Routes>
    </div>
  );
}

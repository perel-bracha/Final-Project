import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TeacherForm from "./pages/TeacherForm";
import Hello from "./pages/Hello";
import TeacherSchedule from "./components/TeacherSchedule";

function App() {
  return (

    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="hello/*" element={<Hello />}></Route>
        {/* <Route path="personal-details" element={<TeacherForm />} />
        <Route path="teacher-schedule" element={<TeacherSchedule />} /> */}
      </Routes>
    </div>
  );
}

export default App;

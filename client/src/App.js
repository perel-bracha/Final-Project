import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TeacherForm from "./pages/TeacherForm";
import AddTeacher from "./components/AddTeacher";
import AddUpdateSpe from "./components/AddUpdateSpe";
import AddCourse from "./components/AddCourse";
import AddTeam from "./components/AddTeam";
import Hello from "./pages/Hello";
import ExcelReader from "./components/xlsx";

function App() {
  return (
    // <div className="App">
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="hello" element={<Hello />} />

    //     {/* <Route path="home"> */}
    //     {/* <Route index element={<Home />} /> */}
    //     <Route path="addTeacher" element={<AddTeacher />} />
    //     <Route path="addSpe" element={<AddUpdateSpe />} />
    //     <Route path="addTeam" element={<AddTeam />} />
    //     <Route path="addCourse" element={<AddCourse />} />
    //     {/* </Route> */}

    //     <Route path="teacher" element={<TeacherForm />} />
    //   </Routes>
    // </div>
    
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="hello/*" element={<Hello />} />
        <Route path="teacher" element={<TeacherForm />} />
      </Routes>
    </div>
  );
}

export default App;

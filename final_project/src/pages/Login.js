import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { LoginFetch, Read,  } from "../fetch";
import "./styles/style.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // משתנה לאחסון הודעות שגיאה
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await LoginFetch(username, password);
      console.log("response", response);
      console.log("response.token", response.token);
      if (response.token) {
        localStorage.setItem("authToken", response.token); // שמירת ה-token ב-localStorage
        const emp = await Read(
          `/employees/?id=${username}&login=true`
        );
        navigate("hello", { state: { emp: emp[0] } });
      } else {
        setError("Failed to log in");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      alert(errorMessage);
      console.error("Error during login:", error);
      console.log(error.response);
      console.log("error", error);
      console.log(error.response?.data);
      setError(error.response?.data?.error || "An unexpected error occurred"); // שמירת הודעת השגיאה
      setUsername(""); // איפוס שדות הקלט
      setPassword(""); // איפוס שדות הקלט
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(""); // הסתרת הודעת השגיאה בעת הזנת נתונים חדשים
  };
  return (
    <div className="login">
      <h1> Login </h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleInputChange(setUsername)}
      />
      <input
        type="password" // תיקון טקסט הקלט לסיסמה
        placeholder="Password"
        value={password}
        onChange={handleInputChange(setPassword)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Read } from "../fetch";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const handleLogin = () => {
//     /////האם צריך להיות בתוך useEffect?

//     Read(`/employees/?id=${password}`).then((res) => {
//       if (res.length === 1) {
//         // if (res.length) {
//         // } else {
//         console.log(res.status);
//         console.log(res);
//         console.log(res[0].FirstName);
//         ///האם היא רכזת?
//         useEffect(() => {
//           Read(`/speces/?empId=${res[0].EmpId}`).await((speRes) => {
//             console.log(speRes);
//             if (speRes.length !== 0) {
//               console.log(speRes[0].EmpId);
//               navigate("home", { coordinator: speRes[0].EmpId }); //שליחת מגמה
//               setPassword("");
//             } else {
//               navigate("teacher", { state: res[0] }); //שליחת עובד
//               setPassword("");
//             }
//           });
//         }[]);

//         // }
//       } else {
//         alert("User whith this id does not exist");
//         setPassword("");
//       }
//     });
//   };
//   return (
//     <div className="Login">
//       <h1> Login </h1>

//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

// const handleLogin = async () => {
//   try {
//     const existEmp = await Read(`/employees/?id=${password}&login=true`);
//     if (existEmp.length === 1) {
//       // console.log(res);
//       // console.log(res[0].FirstName);
//       // const speRes = await Read(`/speces/?empId=${res[0].EmpId}`);
//       // console.log(speRes);
//       // if (speRes.length !== 0) {
//       console.log(existEmp[0]);
//       // navigate("home", { state: { spe: speRes[0] } }); //שליחת מגמה
//       navigate("hello", { state: { emp: existEmp[0] } }); //שליחת מגמה

//       // } else {
//       // navigate("teacher", { state: { emp: existEmp[0] } }); //שליחת עובד
//       // }
//       setPassword("");
//     } else {
//       alert("User with this ID does not exist");
//       setPassword("");
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//   }
// };

// return (
//   <div className="Login">
//     <h1> Login </h1>
//     <input
//       type="text"
//       placeholder="Username"
//       value={username}
//       onChange={(e) => setUsername(e.target.value)}
//     />
//     <input
//       type="password" // תיקון טקסט הקלט לסיסמה
//       placeholder="Password"
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//     />
//     <button onClick={handleLogin}>Login</button>
//   </div>
// );

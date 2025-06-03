import { useState } from "react";
import { LoginFetch } from "../fetch";
import "../styles/style.css"; // ייבוא קובץ ה-CSS לעיצוב

export default function Entry({ loginVerification ,showEntry}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // מצב להצגת הסיסמה
  const [error, setError] = useState(""); // משתנה לאחסון הודעות שגיאה

  const handleSubmit = async () => {
    try {
      const response = await LoginFetch(username, password);
      console.log("response", response);
      console.log("response.token", response.token);
      if (response.token) {
        loginVerification(response.token);
        //*****//במימוש הפונקציה loginVerification צריך קודם כל לבטל את התצוגה של הקומפוננטה הזו Entry.
        showEntry(false);
      } else {
        setError("Failed to verify login");
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

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="entry">
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleInputChange(setUsername)}
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handleInputChange(setPassword)}
          />

          <button
            type="button"
            className="toggle-password"
            onClick={toggleShowPassword}
          >
            {showPassword ? "🙈" : "👁️"} {/* אייקון עין */}
          </button>
        </div>

        <button type="submit">אימות</button>
      </form>
    </div>
  );
}

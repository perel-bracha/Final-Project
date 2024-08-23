import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Insert, Read, Update } from "../fetch";
import { Team } from "../objects/teamObj";

export default function AddTeam() {
  // const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(new Team());
  const [firstReadSpe, setFirstReadSpe] = useState(true);
  const [speces, setSpeces] = useState([]);
  console.log(formData);

  useEffect(() => {
    if (firstReadSpe) {
      readSpeces();
    }
  }, [firstReadSpe]);

  const readSpeces = async () => {
    try {
      const res = await Read("/speces"); //לעשות שיהיה בשרת אופציה
      setSpeces(res); // קבלת רשימת המורים מהשרת והצגתם ברשימה
      setFirstReadSpe(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //`כאן תתבצע הטיפול בשליחת הנתונים לשרת להוספה או עדכון
    try {
      console.log(formData);
      await Insert(`/teams`, { newTeam: formData }); // const res =
      navigate(-1);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="addUpdateSpe">
      <form onSubmit={handleSubmit}>
        <h2>הוספת קבוצה</h2>

        <div>
          <label>קוד קבוצה:</label>
          <input type="text" name="SpeId" value={formData.TeamId} readOnly />
        </div>

        <div>
          <label>מגמה:</label>
          <select
            value={formData.SpeId}
            onChange={(e) =>
              setFormData({ ...formData, SpeId: e.target.value })
            }
            required
          >
            {speces.map((spe, index) => (
              <option
                key={index}
                value={spe.SpeId}
              >{`${spe.SpeName}`}</option>
            ))}
          </select>
        </div>

        <div>
          <label>מספר תלמידות:</label>
          <input
            type="text"
            name="StudentsNumber"
            value={formData.StudentsNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>שנת התחלת הלימודים</label>
          <input
            type="text"
            name="StartingStudiesYear"
            value={formData.StartingStudiesYear}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit"> הוסף</button>
      </form>
    </div>
  );
}

//   this.TeamId = teamId;
//   this.SpeId = speId;
//   this.StudentsNumber = studentsNumber;
//   this.StartingStudiesYear = startingStudiesYear;

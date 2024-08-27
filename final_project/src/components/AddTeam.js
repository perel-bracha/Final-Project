import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Insert } from "../fetch";
import { Team } from "../objects/teamObj";

export default function AddTeam({ spe }) {
  const navigate = useNavigate();
  const currentSpe = spe;
  const [formData, setFormData] = useState(new Team(0, spe.SpeId));
  console.log("formDat", formData);

  console.log("spe", spe);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setFormData({ ...formData, SpeId: currentSpe.SpeId });
      console.log("formDat", formData);
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
          <input type="text" name="TeamId" value={formData.TeamId} readOnly />
        </div>

        <div>
          <label>מגמה:</label>
          <input type="text" name="SpeId" value={spe.SpeName} readOnly />
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

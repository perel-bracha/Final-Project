import React, { useState } from "react";
import * as XLSX from "xlsx";

function ExcelReader() {
  const [data, setData] = useState([]);

  // פונקציה שקוראת את הנתונים מהקובץ
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // קריאה של הגיליון הראשון
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // שמירה של הנתונים ב-state
      setData(jsonData);
    };

    // קריאה של הקובץ בפורמט binary
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h1>Upload an Excel File</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      
      {/* הצגה של הנתונים */}
      <table>
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExcelReader;
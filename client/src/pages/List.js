import { use } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Read } from "../fetch";

export function List({ whatToShow }) {
  const speName =useParams().speName;
  console.log(speName);
  const [list, setList] = useState([]);
const whats={employees:"מורות", courseForTeam:"קורסים"};

//   if (!speName) {
//     return <div>Error: Specialization name is required in the URL.</div>;
//   }
//   const validWhatToShow = ["employees", "courses"];
//   if (!validWhatToShow.includes(whatToShow)) {
//     return (
//       <div>
//         Error: Invalid 'whatToShow' parameter. Must be 'teachers' or 'courses'.
//       </div>
//     );
//   }
  useEffect(() => {
    // Fetch the list based on majorId and whatToShow
    const fetchList = async () => {
      try {
        const response = await Read(`/${whatToShow}/?speName=${speName}`);
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        console.log("Fetched list:", response);
        
        setList(response);
      } catch (error) {
        console.error("Error fetching list:", error);
      }
    };
    fetchList();
  }, [speName, whatToShow]);
  if (list.length === 0) {
    return <div>Loading...</div>;
  }

  // Get all unique keys from the objects to use as table headers
  const headers = Array.from(
    list.reduce((acc, item) => {
      Object.keys(item).forEach((key) => acc.add(key));
      return acc;
    }, new Set())
  );

  return (
    <div className="list">
      <h2>רשימת {whats[whatToShow]} עבור התמחות: {speName}</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((item, idx) => (
            <tr key={item.id || idx}>
              {headers.map((header) => (
                <td key={header}>{String(item[header] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

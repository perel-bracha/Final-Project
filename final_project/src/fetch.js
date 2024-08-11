let serverPath = "http://localhost:8000";
///איך מזהים שגיאה????????????????????????????????????????????????????????????
export function Read(query) {
  let fullpath = serverPath + query;
  console.log(fullpath);

  return fetch(fullpath)
    .then((respones) => respones.json())
    .then((json) => {
      return json;
    });
} ///למה כל כך הרבה Then?

export function Insert(serverAddress, newObj) {
  let fullpath = serverPath + serverAddress;

  console.log("Insert: ", fullpath);

  newObj = JSON.stringify(newObj);
  console.log(newObj);

  return fetch(fullpath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: newObj,
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error occurred while inserting data");
      }
      return data;
    })
    .then((data) => {
      alert("add success");
      return data;
    })
    .catch((error) => {
      console.error("Error: ", error.message);
      throw error; // Throwing the error to be caught in the calling function
    });
}

export function Update(query, updatedData) {
  let fullpath = serverPath + query;
  updatedData = JSON.stringify(updatedData);
  console.log(updatedData);

  return fetch(fullpath, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: updatedData,
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error occurred while inserting data");
      }
      return data;
    })
    .then((data) => {
      alert("update success");
      return data;
    })
    .catch((error) => {
      console.error("Error: ", error.message);
      throw error; // Throwing the error to be caught in the calling function
    });
}

export function Delete(serverAddress) {
  let fullpath = serverPath + serverAddress;
  console.log("Delete: ", fullpath);
  return fetch(fullpath, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("delete Succses");
      }
      return response.json();
    })
    .then((json) => {
      return json;
    });
}

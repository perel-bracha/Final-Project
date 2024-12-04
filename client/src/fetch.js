let serverPath = "http://localhost:8000";
///איך מזהים שגיאה?

// export function Read(query) {
//   let fullpath = serverPath + query;
//   console.log(fullpath);

//   return fetch(fullpath)
//     .then((respones) => respones.json())
//     .then((json) => {
//       return json;
//     });
// } ///למה כל כך הרבה Then?

export function Read(query) {
  console.log(" query:", serverPath + query);

  const token = localStorage.getItem("authToken");

  console.log("token", token);
  console.log({
    "Content-Type": "application/json", //?
    Authorization: `Bearer ${token}`,
  });

  let fullpath = serverPath + query;
  return fetch(fullpath, {
    headers: {
      "Content-Type": "application/json", //?
      Authorization: `Bearer ${token}`,
    },
  }).then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Request failed");
    }
  });
}

export function LoginFetch(username, password) {
  const token = localStorage.getItem("authToken");
  let fullpath = serverPath + "/login";
  console.log("fetchLogin", fullpath);

  return fetch(fullpath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ empId: username, password: password }),
  }).then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Login failed");
    }
  });
}

export function Insert(serverAddress, newObj) {
  const token = localStorage.getItem("authToken");
  let fullpath = serverPath + serverAddress;

  console.log("Insert: ", fullpath);
  console.log(JSON.stringify(newObj));

  return fetch(fullpath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newObj),
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
  const token = localStorage.getItem("authToken");
  let fullpath = serverPath + query;
  updatedData = JSON.stringify(updatedData);
  console.log(updatedData);

  return fetch(fullpath, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const token = localStorage.getItem("authToken");
  let fullpath = serverPath + serverAddress;
  console.log("Delete: ", fullpath);
  return fetch(fullpath, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

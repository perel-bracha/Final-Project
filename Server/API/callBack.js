//callBack.js
const callBack = (err, result, res) => {
  if (err) {
    console.log("in the query of callback");
    res.status(404).json(err);//?איפה נראה את השם של השגיאה המסויימת//error: "Internal Server Error" 
  } else res.status(200).json(result);
  return res;
};

module.exports = callBack;

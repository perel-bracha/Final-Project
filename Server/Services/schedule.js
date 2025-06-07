async function scheduleForTeacher(empId, callBack, resToCallBack) {
 const [scheduledList] = await conDB
        .promise()
        .query(
          `SELECT Day, EndTime, BeginningTime, CourseName, UnitId FROM schedule s NATURAL JOIN courseForTeam ctf NATURAL JOIN course c WHERE ?=(SELECT EmpId FROM courseForTeam ct WHERE ct.CTId=s.CTId)`,
          [empId]
        );
        return callBack(null, scheduledList, resToCallBack);
}

module.exports=scheduleForTeacher;
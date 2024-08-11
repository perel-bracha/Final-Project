export function Schedule(schedId = 0, ctId = "", unitId = "", day = "", beginningTime = "", endTime = "") {
  this.SchedId = schedId;
  this.CTId = ctId;
  this.UnitId = unitId;
  this.Day = day;
  this.BeginningTime = beginningTime;
  this.EndTime = endTime;
}
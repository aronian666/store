export const getInputDate = (date, time = false) => {
  if (typeof date != "object") date = new Date(parseInt(date))
  const currentDate = date.toISOString().substring(0, 10);
  const currentTime = date.toLocaleTimeString().split(":")
  if (currentTime[0].length === 1) {
    currentTime[0] = `0${currentTime[0]}`
  }
  time = time ? "T" + currentTime[0] + ":" + currentTime[1] : ""
  return currentDate + time
}
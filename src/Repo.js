class Repo {
  constructor() {
    this.data;
  }

  storeData(data) {
    if (Array.isArray(data)) this.data = data;
  }

  findById(id, date) {
    return this.data.find(dataPoint => {
        return dataPoint.userID === id && dataPoint.date === date;
    });
  }

  findAllUserData(id) {
    return this.data.filter((dataPoint) => {
      if (dataPoint.userID === id) return dataPoint;
    });
  }
 
  calculateAverage(key, id) {  
    return this.data.reduce((average, dataPoint) => {
      let averageMath = average + dataPoint[key] / this.data.length;
      if (id && dataPoint.userID === id) {
        average = averageMath
        return average;
      } else {
        average = averageMath
        return average;
      }
    }, 0);
  }


  getToday(id) {
    return this.sortUserDataByDate(id)[0].date;
  }

  getFirstWeek(id) {
    return this.sortUserDataByDate(id).slice(0, 7);
  }

  getAllDataByDay(date) { // better name: getAllDataByDay
    return this.data.filter(dataItem => {
      return dataItem.date === date
    });
  } 


  getAllUserAverageForDay(date, userRepo, dataPropertyName) {
    let selectedDayData = this.chooseDayDataForAllUsers(this.activityData, date);
    return parseFloat((selectedDayData
      .reduce((sum, average) => sum += average[dataPropertyName], 0) / selectedDayData.length).toFixed(1));
  }

  
  getAllDataByWeek(date) {  // better name: getAllDataByWeek
    return this.data.filter(dataItem => {
      // next line needs to get broken up

      return (new Date(date)).setDate((new Date(date)).getDate() - 7) <= new Date(dataItem.date) && new Date(dataItem.date) <= new Date(date)
    })
  }

  getAllDataById(id) {
    return this.data.filter(dataPoint => dataPoint.userID === id)
  }  // [{acitivities}]

  getUserDataByWeek(date, id) {  // returns a slice of a sorted array, with entire dataPoints. [{act} {act} ...]
    let userDataByDate = this.sortUserDataByDate(id, this.data);
    let dateIndex = userDataByDate.indexOf(userDataByDate.find(firstItem => firstItem.date === date));
    return userDataByDate.slice(dateIndex, dateIndex + 7);
  }

  getUserAverageForWeek(id, date, key) {
    let weekData = this.data.getUserDataByWeek(date, id)
    let floatAverage = weekData.reduce((average, dataPoint) => {
      average = average + dataPoint[key] / weekData.length
      return floatAverage.toFixed(1);
    }, 0)

    return 
  }

  sortUserDataByDate(id) { // better name: sortUserDataByDate
    let selectedID = this.getAllDataById(id)
    let sortedByDate = selectedID.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedByDate;
  }

  
  sortDataByDate(id) {
    let usersData = this.findAllUserData(id);
    return usersData.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export default Repo
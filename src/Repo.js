class Repo {
  constructor() {
    this.data;
  }

  storeData(data) {
    if (Array.isArray(data)) this.data = data;
  }

  findById(id, date) {
    return this.data.find((dataPoint) => {
        return dataPoint.userID === id && dataPoint.date === date;
    });
  }

  findAllUserData(id) {
    return this.data.filter((dataPoint) => {
      if (dataPoint.userID === id) return dataPoint;
    });
  }
 
  //Like findById, if Id is defined it should calculate average for a user.
  //Otherwise it'll calculate the average of an entire dataset.
  //Probably could be condensed
  //Should be tested
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

  // unecessary for users. required for UserRepo.getToday(). Does UserRepo need to be the only one that can determine the current day? Is this the only use case for sorting arrays?
  sortDataByDate(id) {
    let usersData = this.findAllUserData(id);
    return usersData.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export default Repo
class Repo {
  constructor() {
    this.data;
  }

  storeData(data) {
    if (Array.isArray(data)) this.data = data;
  }

  findById(id, date) {
    return this.data.find((dataPoint) => {
      if (date) {
        return dataPoint.userID === id && dataPoint.date === date;
      } else {
        return dataPoint.id === id;
      }
    });
  }

  findAllUserData(id) {
    return this.data.filter((dataPoint) => {
      if (dataPoint.userID === id) return dataPoint;
    });
  }

  getUserDatabyDate(id, date) {
    userDatabyDate = this.data.find(data => id === data.userID && date === data.date);
  }

  getToday(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet)[0].date;
  }

  getFirstWeek(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet).slice(0, 7);
  }

  chooseDayDataForAllUsers(dataSet, date) {
    return dataSet.filter(dataItem => {
      return dataItem.date === date
    });
  } 

  chooseWeekDataForAllUsers(dataSet, date) {
    return dataSet.filter(dataItem => {
      return (new Date(date)).setDate((new Date(date)).getDate() - 7) <= new Date(dataItem.date) && new Date(dataItem.date) <= new Date(date)
    })
  }

  getWeekFromDate(date, id, dataSet/*date = '2019/04/19' id = 13 dataSet = activityData*/) {
    let dateIndex = this.makeSortedUserArray(id, dataSet).indexOf(this.makeSortedUserArray(id, dataSet).find((sortedItem) => (sortedItem.date === date)));
    return this.makeSortedUserArray(id, dataSet).slice(dateIndex, dateIndex + 7);
  }

  makeSortedUserArray(id, dataSet/*= ex. activityData */) {
    let selectedID = this.getDataFromUserID(id, dataSet)
    let sortedByDate = selectedID.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedByDate;
  }

  calculateAverage(key) {
    return this.data.reduce((average, dataPoint) => {
      average = average + dataPoint[key] / this.data.length;
      return average;
    }, 0);
  }

  
  sortDataByDate(id) {
    let usersData = this.findAllUserData(id);
    return usersData.sort((a, b) => new Date(b.date) - new Date(a.date));
  }



  // calculateAverage(id, key) {
  //   const usersData = this.data.filter((data) => id === data.userID);

  //   const average = usersData.reduce((average, data) => {
  //     return (average = average + data[key] / usersData.length);
  //   }, 0);

  //   return Math.round(average);
  // }
}



export default Repo
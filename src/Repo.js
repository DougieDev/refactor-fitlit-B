class Repo {
  constructor() {
  }

  storeData(data, src) {
    if (src === 'userData' && this.dataIsCorrect(data, src)) {
      this.users = data; 
    } else if (src === "hydrationData" && this.dataIsCorrect(data, src)) {
      this.hydration = data;
    } else if (src === "sleepData" && this.dataIsCorrect(data, src)) {
      this.sleep = data;
    } else if (src === "activityData" && this.dataIsCorrect(data, src)) {
      this.activity = data;
    } else {
      return "You have provided either incomplete or incorrect data";
    }
  }

  dataIsCorrect(data, src) {
    const requirements = {
      'userData': ["id", "name", "address", "email", "strideLength", "dailyStepGoal", "friends"],
      'hydrationData': ['userID', 'date', 'numOunces'],
      'activityData': ['userID', 'date', 'numSteps', 'minutesActive', 'flightsOfStairs'],
      'sleepData': ['userID', 'date', 'hoursSlept', 'sleepQuality']
    };
    
    let keys = Object.keys(data[0]); 
    keys = keys.map(key => key.toString());

    if(requirements[src].every(requirement => keys.includes(requirement))) {
      return true
    } else {
      return false
    }
    return true
  }

  getDataFromId(id, dataSet) {
    return dataSet.filter(data => id === data.userID);
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

}



export default Repo
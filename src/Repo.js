class Repo {
  constructor() {
    this.currentId = this.pickRandomUser()
  }

  pickRandomUser()

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
    // const requirements = {
    //   'userData': ["id", "name", "address", "email", "strideLength", "dailyStepGoal", "friends"],
    //   'hydrationData': ['userID', 'date', 'numOunces'],
    //   'activityData': ['userID', 'date', 'numSteps', 'minutesActive', 'flightsOfStairs'],
    //   'sleepData': ['userId', 'date', 'hoursSlept', 'sleepQuality']
    // };
    
    // let keys = Object.keys(data[0]); 
    // keys = keys.map(key => key.toString());

    // if(requirements[src].every(requirement => keys.includes(requirement))) {
    //   return true
    // } else {
    //   return false
    // }
    return true
  }

  getDataFromId(id, dataSet) {
    return dataSet.filter(data => id === data.userID);
  }

}



export default Repo
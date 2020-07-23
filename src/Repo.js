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

  calculateAverage(key) {
    return this.data.reduce((average, dataPoint) => {
      average = average + dataPoint[key] / this.data.length;
      return average;
    }, 0);
  }

  // unecessary for users. required for UserRepo.getToday(). Does UserRepo need to be the only one that can determine the current day? Is this the only use case for sorting arrays?
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
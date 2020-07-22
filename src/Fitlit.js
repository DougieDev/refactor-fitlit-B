class Fitlit {
  constructor(data){
    this.data = data;
  }
  
  getData(id, date, key) {
    const dataSet = this.data.find(data => {
      return id === data.userID && date === data.date;
    }) 
    return dataSet[key];
  }

  calculateAverage(id, key) {
    const usersData = this.data.filter(data => id === data.userID);

    const average = usersData.reduce((average, data) => {
      return average = average + data[key] / usersData.length;
    }, 0)

    return Math.round(average);
  }
}

export default Fitlit;
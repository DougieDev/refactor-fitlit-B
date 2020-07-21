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
}

export default Fitlit;
class Repo {

  constructor() {
    this.data;
  }

  storeData(data) {
    if (Array.isArray(data)) {
      this.data = data;
    }
  }

  findById(id, date) {
    if (typeof id !== "number") {
      return "This id is incorrect";
    } else if (typeof date !== "string" || !this.dateRule(date)) {
      return "This date is improperly formatted";
    }

    return this.data.find((dataPoint) => {
      return dataPoint.userID === id && dataPoint.date === date;
    });
  }

  dateRule(date) {
    if (typeof date !== "string") return false;
    date = date.split("/");
    if (
      date[0].length === 4 &&
      date[1].length === 2 &&
      date[2].length === 2 &&
      date.every((number) => parseInt(number))
    ) {
      return true;
    } else {
      return false;
    }
  }

  keyRule(key) {
    this.data.every((dataPoint) => Object.keys(dataPoint).includes(key));
  }

  getAllDataById(id) {
    if (typeof id !== "number") return "This id is incorrect";
    return this.data.filter((dataPoint) => dataPoint.userID === id);
  }

  calculateAverage(key, id) {
    let average = this.data
      .reduce((average, dataPoint) => {
        if (typeof id === "number" && dataPoint.userID === id) {
          let userSet = this.data.filter(
            (dataPoint) => dataPoint.userID === id
          );
          average += dataPoint[key] / userSet.length;
          return average;
        } else if (!id) {
          average += dataPoint[key] / this.data.length;
          return average;
        } else {
          return average;
        }
      }, 0)
      .toFixed(1);
    return parseFloat(average);
  }

  sortUserDataByDate(id) {
    if (typeof id !== "number") return "This id is incorrect";
    let selectedID = this.getAllDataById(id);
    return selectedID.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  sortDataByDate(id) {
    let usersData = this.getAllDataById(id);
    return usersData.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getToday(id) {
    if (typeof id !== "number") return "This id is incorrect";
    return this.sortUserDataByDate(id)[0].date;
  }

  getFirstWeek(id) {
    return this.sortUserDataByDate(id).slice(0, 7);
  }

  getAllDataByDay(date) {
    if (!this.dateRule(date)) return "This date is improperly formatted";
    return this.data.filter((dataItem) => {
      return dataItem.date === date;
    });
  }

  getAllDataByWeek(date) {
    return this.data.filter((dataItem) => {
      // next line needs to get broken up

      return (
        new Date(date).setDate(new Date(date).getDate() - 7) <=
          new Date(dataItem.date) && new Date(dataItem.date) <= new Date(date)
      );
    });
  }

  getUserDataByWeek(date, id) {
    let userDataByDate = this.sortUserDataByDate(id, this.data);
    let dateIndex = userDataByDate.indexOf(
      userDataByDate.find((firstItem) => firstItem.date === date)
    );
    return userDataByDate.slice(dateIndex, dateIndex + 7);
  }

  getUserAverageForWeek(id, date, key) {
    if (!this.dateRule(date)) {
      return "This date is improperly formatted";
    } else if (typeof id !== "number") {
      return "This id is not properly formatted";
    } else if (this.keyRule(key) === false) {
      return "The key does not correspond with the dataset";
    }

    let weekData = this.getUserDataByWeek(date, id);
    return parseFloat(
      weekData
        .reduce((average, dataPoint) => {
          average = average + dataPoint[key] / weekData.length;
          return average;
        }, 0)
        .toFixed(1)
    );
  }

  getAllUserAverageForDay(date, key) {
    if (!this.dateRule(date) || this.keyRule(key) === false) {
      return "One of the parameters are incorrect";
    }
    let selectedDayData = this.getAllDataByDay(date);
    return parseFloat(
      selectedDayData
        .reduce((average, data) => {
          average = average + data[key] / selectedDayData.length;
          return average;
        }, 0)
        .toFixed(1)
    );
  }



  presentWeek(date, id) {
    let allDates = this.sortUserDataByDate(id);
    allDates = allDates.map(dataPoint => dataPoint.date)
    let i = allDates.indexOf(date);
    return allDates.slice(i, i + 7);
  }
}

export default Repo
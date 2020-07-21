class Hydration extends Fitlit {
  constructor(hydrationData) {
    this.hydrationData = hydrationData;
  }

  /*IF REMOVED, REMOVES ALL DATA EXCEPT USER PERSONAL DATA EX. NAME/ ADDRESS/ ETC...*/
  calculateAverageOunces(id) {
    let perDayUserHydration = this.hydrationData.filter((data) => id === data.userID);
    return perDayUserHydration.reduce((sumSoFar, data) => {
      return sumSoFar += data.numOunces;
    }, 0) / perDayUserHydration.length;
  }

  /*SAME AS ABOVE*/
  calculateDailyOunces(id, date) {
    let findOuncesByDate = this.hydrationData.find((data) => id === data.userID && date === data.date);
    return findOuncesByDate.numOunces;
  }

  /*IF REMOVED, REMOVES ALL DATA EXCEPT USER PERSONAL DATA AND DAILY/ AVERAGE WATER*/
  calculateFirstWeekOunces(userRepo, id) {
    return userRepo.getFirstWeek(id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }

  /*IF REMOVED, REMOVES ALL DATA EXCEPT USER PERSONAL INFO, DAILY WATER/AVERAGE &
  WATER INTAKE THIS WEEK*/
  calculateRandomWeekOunces(date, id, userRepo) {
    return userRepo.getWeekFromDate(date, id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }
}


export default Hydration;

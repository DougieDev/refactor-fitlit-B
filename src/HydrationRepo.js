import Repo from './Repo';

class HydrationRepo extends Repo {
  constructor(hydrationData) {
    super(hydrationData);
  }

  /*IF REMOVED, REMOVES ALL DATA EXCEPT USER PERSONAL DATA EX. NAME/ ADDRESS/ ETC...*/
  calculateAverageOunces(id) {
    let perDayUserHydration = this.data.filter((data) => id === data.userID);
    return perDayUserHydration.reduce((sumSoFar, data) => {
      return sumSoFar += data.numOunces;
    }, 0) / perDayUserHydration.length;
  }

  /*SAME AS ABOVE*/
  // calculateDailyOunces(id, date) {
  //   let findOuncesByDate = this.data.find((data) => id === data.userID && date === data.date);
  //   return findOuncesByDate.numOunces;
  // }

  /*IF REMOVED, REMOVES ALL DATA EXCEPT USER PERSONAL DATA AND DAILY/ AVERAGE WATER*/
  calculateFirstWeekOunces(id) {
    return this.getFirstWeek(id, this.data).map((data) => `${data.date}: ${data.numOunces}`);
  }

  /*IF REMOVED, REMOVES ALL DATA EXCEPT USER PERSONAL INFO, DAILY WATER/AVERAGE &
  WATER INTAKE THIS WEEK*/
  calculateRandomWeekOunces(date, id) {
    return this.getWeekFromDate(date, id, this.data).map((data) => `${data.date}: ${data.numOunces}`);
  }
}


export default HydrationRepo;

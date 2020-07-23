import Repo from "./Repo";

class SleepRepo extends Repo {
  constructor(sleepData) {
    super(sleepData);
  }
  /* removing did not seem to have any effect on page display*/
  calculateAverageSleep(id) {
    let perDaySleep = this.data.filter((data) => id === data.userID);
    return perDaySleep.reduce((sumSoFar, data) => {
      return sumSoFar += data.hoursSlept;
    }, 0) / perDaySleep.length;
  }

  /* removing also does not have any effect on the display*/
  calculateAverageSleepQuality(id) {
    let perDaySleepQuality = this.data.filter((data) => id === data.userID);
    return perDaySleepQuality.reduce((sumSoFar, data) => {
      return sumSoFar += data.sleepQuality;
    }, 0) / perDaySleepQuality.length;
  }

  /*IF REMOVED, REMOVES ALL ACTIVITY DATA, STREAKS, SLEEP DATA, FRIENDS STATS,
  DOES NOT EFFECT PERSONAL INFO OR WATER CARDS */
  calculateDailySleep(id, date) {
    let findSleepByDate = this.data.find((data) => id === data.userID && date === data.date);
    return findSleepByDate.hoursSlept;
  }

  /* SAME AS FUNCTION ABOVE, EXCEPT DAILY SLEEP HOURS STILL DISPLAYS*/
  calculateDailySleepQuality(id, date) {
    let findSleepQualityByDate = this.data.find((data) => id === data.userID && date === data.date);
    return findSleepQualityByDate.sleepQuality;
  }

  /* IF REMOVED, REMOVES ALL ACTIVITY DATA, FRIENDS STATS, STREAKS, WEEKLY SLEEP STATS,
  DOES DISPLAY SLEEP DAILY(HOURS TODAY, QUALITY, AND AVERAGE)*/
  calculateWeekSleep(date, id, userRepo) {
    return this.getWeekFromDate(date, id, this.data).map((data) => `${data.date}: ${data.hoursSlept}`);
  }

  /* does not effect display may not be used or broken*/
  calculateWeekSleepQuality(date, id, userRepo) {
    return this.getWeekFromDate(date, id, this.data).map((data) => `${data.date}: ${data.sleepQuality}`);
  }

  /*IF REMOVED, REMOVES ALL ACTIVITY DATA, FRIENDS STATS, STREAKS, WEEKLY SLEEP STATS, AND SLEEP AVERAGE
  DOES DISPLAY SLEEP DAILY(HOURS TODAY, QUALITY)*/
  calculateAllUserSleepQuality() {
    var totalSleepQuality = this.data.reduce(function(sumSoFar, dataItem) {
      sumSoFar += dataItem.sleepQuality;
      return sumSoFar;
    }, 0)
    return totalSleepQuality / data.length
  }

  
/* does not seem to effect display function needs to be checked if working,
  may of not been added to project due to time*/
  determineBestSleepers(date, userRepo) {
    let timeline = this.chooseWeekDataForAllUsers(this.data, date);
    let userSleepObject = userRepo.isolateUsernameAndRelevantData(this.data, date, 'sleepQuality', timeline);

    return Object.keys(userSleepObject).filter(function(key) {
      return (userSleepObject[key].reduce(function(sumSoFar, sleepQualityValue) {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / userSleepObject[key].length) > 3
    }).map(function(sleeper) {
      return this.getDataFromID(parseInt(sleeper)).name;
    })
  }

  /*same as above does not seem to have made it into the display or application*/
  determineSleepWinnerForWeek(date, userRepo) {
    let timeline = this.chooseWeekDataForAllUsers(this.data, date);
    let sleepRankWithData = userRepo.combineRankedUserIDsAndAveragedData(this.data, date, 'sleepQuality', timeline);

    return this.getWinnerNamesFromList(sleepRankWithData, userRepo);
  }

  /* removing has no effect on display, same action as above*/
  determineSleepHoursWinnerForDay(date, userRepo) {
    let timeline = this.chooseDayDataForAllUsers(this.data, date);
    let sleepRankWithData = userRepo.combineRankedUserIDsAndAveragedData(this.data, date, 'hoursSlept', timeline);

    return this.getWinnerNamesFromList(sleepRankWithData, userRepo);
  }

  /* did not seem to make it into final project also looks really similar to alot of the weekly display functions 
  could create a helper function to display all information by week*/
  getWinnerNamesFromList(sortedArray, userRepo) {
    let bestSleepers = sortedArray.filter(function(element) {
      return element[Object.keys(element)] === Object.values(sortedArray[0])[0]
    });

    let bestSleeperIds = bestSleepers.map(function(bestSleeper) {
      return (Object.keys(bestSleeper));
    });

    return bestSleeperIds.map(function(sleepNumber) {
      return this.getDataFromID(parseInt(sleepNumber)).name;
    });
  }
}


export default SleepRepo;

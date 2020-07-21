import Fitlit from "./Fitlit";

class UserRepo {
  constructor(users) {
    this.users = users;
  }

  /* BREAKS ALL DATA IF REMOVED */
  getDataFromID(id) {
    return this.users.find((user) => id === user.id);
  }

  /*SAME AS ABOVE ----DO WE NEED BOTH OF THESE FUNCTIONS? */
  getDataFromUserID(id, dataSet) {
    return dataSet.filter((userData) => id === userData.userID);
  }

  /*REMOVING GETS RID OF ALL GENERATED DATA */
  calculateAverageStepGoal() {
    var totalStepGoal = this.users.reduce((sumSoFar, data) => {
      return sumSoFar = sumSoFar + data.dailyStepGoal;
    }, 0);
    return totalStepGoal / this.users.length;
  }

  /*SAME EFFECT AS ABOVE*/
  makeSortedUserArray(id, dataSet) {
    let selectedID = this.getDataFromUserID(id, dataSet)
    let sortedByDate = selectedID.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedByDate;
  }

  /*Doesnt seem to effect display if removed */
  getToday(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet)[0].date;
  }
  /*REMOVES ALL GENERATED DATA IF REMOVED */
  getFirstWeek(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet).slice(0, 7);
  }

  /*REMOVES ACTIVITY DATA/SLEEP DATA BUT WATER DATA REMAINS 
  WITH THE EXCEPTION OF WEEK OF WATER DATA */
  getWeekFromDate(date, id, dataSet) {
    let dateIndex = this.makeSortedUserArray(id, dataSet).indexOf(this.makeSortedUserArray(id, dataSet).find((sortedItem) => (sortedItem.date === date)));
    return this.makeSortedUserArray(id, dataSet).slice(dateIndex, dateIndex + 7);
  }

  /*IF REMOVED, REMOVES ACTIVITY DATA, FRIENDS SECTION, STREAKS
  DOES NOT EFFECT WATER OR SLEEP SECTIONS */
  chooseWeekDataForAllUsers(dataSet, date) {
    return dataSet.filter(function(dataItem) {
      return (new Date(date)).setDate((new Date(date)).getDate() - 7) <= new Date(dataItem.date) && new Date(dataItem.date) <= new Date(date)
    })
  }
  /*SAME AS ABOVE WITH THE EXCEPTION TO STAIR COUNT STILL APPEARS*/
  chooseDayDataForAllUsers(dataSet, date) {
    return dataSet.filter(function(dataItem) {
      return dataItem.date === date
    });
  } 

  /*REMOVES ALL ACTIVITY DATA, STREAKS INFO, FRIENDS SECTION,
  WATER, AND SLEEP INFO REMAIN.*/
  isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod) {
    return listFromMethod.reduce(function(objectSoFar, dataItem) {
      if (!objectSoFar[dataItem.userID]) {
        objectSoFar[dataItem.userID] = [dataItem[relevantData]]
      } else {
        objectSoFar[dataItem.userID].push(dataItem[relevantData])
      }
      return objectSoFar;
    }, {});
  }

  /*SAME AS ABOVE*/
  rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod) {
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)
    return Object.keys(sortedObjectKeys).sort(function(b, a) {
      return (sortedObjectKeys[a].reduce(function(sumSoFar, sleepQualityValue) {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / sortedObjectKeys[a].length) - (sortedObjectKeys[b].reduce(function(sumSoFar, sleepQualityValue) {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / sortedObjectKeys[b].length)
    });
  }

  /*IF REMOVED, REMOVES ALL DATA IN PROJECT*/
  combineRankedUserIDsAndAveragedData(dataSet, date, relevantData, listFromMethod) {
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)
    let rankedUsersAndAverages = this.rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod)
    return rankedUsersAndAverages.map(function(rankedUser) {
      rankedUser = {
        [rankedUser]: sortedObjectKeys[rankedUser].reduce(
          function(sumSoFar, sleepQualityValue) {
            sumSoFar += sleepQualityValue
            return sumSoFar;
          }, 0) / sortedObjectKeys[rankedUser].length
      }
      return rankedUser;
    });
  }
}

export default UserRepo;

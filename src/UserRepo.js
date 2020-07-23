import Repo from './Repo'

class UserRepo extends Repo  {
  constructor(users) {
    this.users = users;
  }

  /* BREAKS ALL DATA IF REMOVED */
  // works perfectly return user object as expected
  getDataFromID(id) {
    return this.users.find((user) => id === user.id);
  }

  /*SAME AS ABOVE  BREAKS IF REMOVED
  
  it is working as expected didnt see any refactor needed*/
  
  getDataFromUserID(id, dataSet) {
    return dataSet.filter((userData) => id === userData.userID);
  }

  /*REMOVING GETS RID OF ALL GENERATED DATA */
  // function returns average as number ex. 6700
  // function looks right math seems correct
  // refactored removed sumSoFar = not needed 
  calculateAverageStepGoal() {
    var totalStepGoal = this.users.reduce((sumSoFar, data) => {
      return sumSoFar + data.dailyStepGoal;
    }, 0);
    return totalStepGoal / this.users.length;
  }

  /*SAME EFFECT AS ABOVE
  this function returns all user data SORTED from most recent date to furthest date of specific dataSet
  such as activity, sleep, hydration
  it is working correctly it a*/
  makeSortedUserArray(id, dataSet/*= ex. activityData */) {
    let selectedID = this.getDataFromUserID(id, dataSet)
    let sortedByDate = selectedID.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedByDate;
  }

  /*Doesnt seem to effect display if removed 
  this function only returns the data no activity data for day ex. 2019/09/22
  not sure if it is being used at all or if so why*/
  getToday(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet)[0].date;
  }
  /*REMOVES ALL GENERATED DATA IF REMOVED 
  this function does work as expected 
  returns an array of objects that go with a user id
  and return actitvity || hydration || sleep for users first week */
  getFirstWeek(id, dataSet) {
    return this.makeSortedUserArray(id, dataSet).slice(0, 7);
  }

  /*REMOVES ACTIVITY DATA/SLEEP DATA BUT WATER DATA REMAINS 
  WITH THE EXCEPTION OF WEEK OF WATER DATA 
  function works correctly it is able to pick a date for an dataSet
  activity, sleep, hydration and returns a week from the date input*/
  getWeekFromDate(date, id, dataSet/*date = '2019/04/19' id = 13 dataSet = activityData*/) {
    let dateIndex = this.makeSortedUserArray(id, dataSet).indexOf(this.makeSortedUserArray(id, dataSet).find((sortedItem) => (sortedItem.date === date)));
    return this.makeSortedUserArray(id, dataSet).slice(dateIndex, dateIndex + 7);
  }

  /*IF REMOVED, REMOVES ACTIVITY DATA, FRIENDS SECTION, STREAKS
  DOES NOT EFFECT WATER OR SLEEP SECTIONS 
  similar to function above but returns all users data for a week by a single date 
  for dataSet passed in */
  chooseWeekDataForAllUsers(dataSet, date) {
    return dataSet.filter(function(dataItem) {
      return (new Date(date)).setDate((new Date(date)).getDate() - 7) <= new Date(dataItem.date) && new Date(dataItem.date) <= new Date(date)
    })
  }
  /*SAME AS ABOVE WITH THE EXCEPTION TO STAIR COUNT STILL APPEARS
  same idea as above but for only the date selected 
  return all users data for specific dataSet activityData, sleepData, hydrationData*/
  chooseDayDataForAllUsers(dataSet, date) {
    return dataSet.filter(function(dataItem) {
      return dataItem.date === date
    });
  } 

  /*REMOVES ALL ACTIVITY DATA, STREAKS INFO, FRIENDS SECTION,
  WATER, AND SLEEP INFO REMAIN.*/
  //What is relevantData and listFromMethod? 
  //relevantData = string ex "sleepQuality","hoursSlept"
  //listFromMethod = a function return value ex'userRepo.chooseWeekDataForAllUsers(sleepData, "2019/06/21")'
  //Where is this function being used? Looks like is can be used in more places 
  //No 'this' in functions can these functions be moved to another class?
  //I only see this function called below and in Sleep.js
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
  //This function is not currently called in any other files.
  //Why is it breaking display?
  //sleepQuality through out function
  //can we utilize this function for more
  //looks like it might be recording sleepquality but no 100% certain
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
  //Used in activity class in getFriendsAverageStepsPerWeek()
  //Used in sleep class determineSleepWinnerForWeek()
  //and determineSleepHoursWinnerForDay()
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

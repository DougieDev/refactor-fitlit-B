import Repo from "./Repo";

class ActivityRepo extends Repo {
  constructor(activityData) {
    super(activityData);
  }
  
  getMilesFromStepsByDate(id, date) {
    let user = this.getDataFromID(id);
    let userMiles = this.getUserDatabyDate(id, date);
    return parseFloat(((userMiles.numSteps * user.strideLength) / 5280).toFixed(1));
  }
  
  getActiveMinutesByDate(id, date) {
    let userActivityByDate = this.getUserDatabyDate(id, date);
    return userActivityByDate.minutesActive;
  }
 
  calculateActiveAverageForWeek(id, date) {
    return parseFloat((this.getWeekFromDate(date, id, this.activityData)
      .reduce((sum, elem) => {
        return sum += elem.minutesActive;
      }, 0) / 7).toFixed(1));
  }
 
  accomplishStepGoal(id, date, userRepo) {
    let userStepsByDate = this.getUserDatabyDate(id, date);
    return (userStepsByDate.numSteps === userRepo.dailyStepGoal) ? true : false;
  }

 
  getDaysGoalExceeded(id, user) {
    return this.activityData.reduce((dates, data) => {
      if (id === data.userID && data.numSteps > user.dailyStepGoal) {
        dates.push(data.date);
      }
      return dates;
    },[]);
  }
  
  getStairRecord(id) {
    return this.activityData
      .filter(data => id === data.userID)
      .reduce((record, user) => {
        return (user.flightsOfStairs > record) ? user.flightsOfStairs : record
      }, 0);
  }

  getAllUserAverageForDay(date, userRepo, dataPropertyName) {
    let selectedDayData = this.chooseDayDataForAllUsers(this.activityData, date);
    return parseFloat((selectedDayData.reduce((sum, average) => sum += average[dataPropertyName], 0) / selectedDayData.length).toFixed(1));
  }

  userDataForToday(id, date, userRepo, dataPropertyName) {
    let userData = this.getDataFromUserID(id, this.data);
    return userData.find(data => data.date === date)[dataPropertyName];
  }
 
  userDataForWeek(id, date, userRepo, dataPropertyName) {
    return this.getWeekFromDate(date, id, this.activityData).map(data => `${data.date}: ${data[dataPropertyName]}`);
  }

  // Friends
  
  getFriendsActivity(user, userRepo) {
    let data = this.activityData;
    let userDatalist = user.friends.map(friend => {
      return userRepo.getDataFromUserID(friend, data)
    });
    return userDatalist.reduce(function(arraySoFar, listItem) {
      return arraySoFar.concat(listItem);
    }, []);
  }

  getFriendsAverageStepsForWeek(user, date, userRepo) {
    let friendsActivity = this.getFriendsActivity(user, userRepo);
    let timeline = this.chooseWeekDataForAllUsers(friendsActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData(friendsActivity, date, 'numSteps', timeline)
  }
 
  showChallengeListAndWinner(user, date, userRepo) {
    let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
    return rankedList.map(listItem => {
      console.log(listItem)
      let userID = Object.keys(listItem)[0];
      console.log(userID)
      let userName = this.getDataFromID(parseInt(userID)).name;
      return `${userName}: ${listItem[userID]}`
    })
  }
  
  showcaseWinner(user, date, userRepo) {
    let namedList = this.showChallengeListAndWinner(user, date, userRepo);
    let winner = this.showChallengeListAndWinner(user, date, userRepo).shift();
    return winner;
  }
 
  getStreak(userRepo, id, relevantData) {
    let data = this.data;
    let sortedUserArray = (userRepo.makeSortedUserArray(id, data)).reverse();
    let streaks = sortedUserArray.filter(function(element, index) {
      if (index >= 2) {
        return (sortedUserArray[index - 2][relevantData] < sortedUserArray[index - 1][relevantData] && sortedUserArray[index - 1][relevantData] < sortedUserArray[index][relevantData])
      }
    });
    return streaks.map(function(streak) {
      return streak.date;
    })
  }
  
  getWinnerId(user, date, userRepo) {
    let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
    let keysList = rankedList.map(listItem => Object.keys(listItem));
    return parseInt(keysList[0].join(''))
  }
}



export default ActivityRepo;

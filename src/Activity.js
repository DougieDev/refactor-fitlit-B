import Fitlit from "./Fitlit";

class Activity extends Fitlit {
  constructor(data) {
    super(data);
  }
  //Test function doesnt change page at all, make sure it is working need to display to the page.
  getMilesFromStepsByDate(id, date, userRepo) {
    let userStepsByDate = this.data.find(data => id === data.userID && date === data.date);
    return parseFloat(((userStepsByDate.numSteps * userRepo.strideLength) / 5280).toFixed(1));
  }
  /*Function doesn't seem to effect the display of the page check where it is called */
  getActiveMinutesByDate(id, date) {
    let userActivityByDate = this.data.find(data => id === data.userID && date === data.date);
    return userActivityByDate.minutesActive;
  }
  /*Removing does not seem to effect the display seem to be a trend on this class */
  calculateActiveAverageForWeek(id, date, userRepo) {
    return parseFloat((userRepo.getWeekFromDate(date, id, this.data).reduce((acc, elem) => {
      return acc += elem.minutesActive;
    }, 0) / 7).toFixed(1));
  }
  /* Again does not seem to effect web display maybe activity class was not used
  correctly or never made it in the project properly or is being analyzed else where*/
  accomplishStepGoal(id, date, userRepo) {
    let userStepsByDate = this.data.find(data => id === data.userID && date === data.date);
    if (userStepsByDate.numSteps === userRepo.dailyStepGoal) {
      return true;
    }
    return false
  }
  /* again no changes to the display, research how we are using our functionality*/
  getDaysGoalExceeded(id, userRepo) {
    return this.data.filter(data => id === data.userID && data.numSteps > userRepo.dailyStepGoal).map(data => data.date);
  }
  /* never made it into the display of page*/
  getStairRecord(id) {
    return this.data.filter(data => id === data.userID).reduce((acc, elem) => (elem.flightsOfStairs > acc) ? elem.flightsOfStairs : acc, 0);
  }
  /* THIS FUNCTION DOES EFFECT THE PAGE, SEEMS TO BE WORKING, REMOVES ALMOST
  ALL USER DATA */
  getAllUserAverageForDay(date, userRepo, relevantData) {
    let selectedDayData = userRepo.chooseDayDataForAllUsers(this.data, date);
    return parseFloat((selectedDayData.reduce((acc, elem) => acc += elem[relevantData], 0) / selectedDayData.length).toFixed(1));
  }
  /*THIS FUNCTION ALSO IF REMOVED BREAKS THE PAGE DISPLAY */
  userDataForToday(id, date, userRepo, relevantData) {
    let userData = userRepo.getDataFromUserID(id, this.data);
    return userData.find(data => data.date === date)[relevantData];
  }
  /*THIS FUNCTION REMOVES ALL DATA FROM DISPLAY USER INFO AND FRIEND INFO*/
  userDataForWeek(id, date, userRepo, releventData) {
    return userRepo.getWeekFromDate(date, id, this.data).map((data) => `${data.date}: ${data[releventData]}`);
  }

  // Friends
  /*BREAKS ALL ACTITIVIY DATA FROM USER AND FRIENDS IF REMOVED*/
  getFriendsActivity(user, userRepo) {
    let data = this.data;
    let userDatalist = user.friends.map(function(friend) {
      return userRepo.getDataFromUserID(friend, data)
    });
    return userDatalist.reduce(function(arraySoFar, listItem) {
      return arraySoFar.concat(listItem);
    }, []);
  }

  /*SAME AS ABOVE*/
  getFriendsAverageStepsForWeek(user, date, userRepo) {
    let friendsActivity = this.getFriendsActivity(user, userRepo);
    let timeline = userRepo.chooseWeekDataForAllUsers(friendsActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData(friendsActivity, date, 'numSteps', timeline)
  }
  /*FUNCTIONS AS IT SAYS, IF REMOVED REMOVES WINNER AND FRIENDS INFO*/
  showChallengeListAndWinner(user, date, userRepo) {
    let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);

    return rankedList.map(function(listItem) {
      let userID = Object.keys(listItem)[0];
      let userName = userRepo.getDataFromID(parseInt(userID)).name;
      return `${userName}: ${listItem[userID]}`
    })
  }

  /* WHEN REMOVED ONLY REMOVES WINNER INFO*/
  showcaseWinner(user, date, userRepo) {
    let namedList = this.showChallengeListAndWinner(user, date, userRepo);
    let winner = this.showChallengeListAndWinner(user, date, userRepo).shift();
    return winner;
  }
  /* REMOVES 3 DAY STEP, INCREASING ACTIVITY FOR USER. REMOVES WEEKLY WINNER*/
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
  /*REMOVING BREAKS ALL ACTIVITY DATA, CHECK DISPLAY SHOULDN'T BREAK WEBSITE IF JUST GRABBING A 
  WINNER ID*/
  getWinnerId(user, date, userRepo) {
    let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
    let keysList = rankedList.map(listItem => Object.keys(listItem));
    return parseInt(keysList[0].join(''))
  }
}



export default Activity;

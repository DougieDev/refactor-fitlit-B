import Repo from "./Repo";

class ActivityRepo extends Repo {
  constructor(activityData) {
    super(activityData);
  }
  //Test function doesnt change page at all, make sure it is working need to display to the page.

  // getUserDatabyDate(id, date) {
  //   userDatabyDate = this.data.find(data => id === data.userID && date === data.date);
  // }



  getMilesFromStepsByDate(id, date) {
    let user = this.getDataFromID(id);
    let userMiles = this.getUserDatabyDate(id, date);
    return parseFloat(((userMiles.numSteps * user.strideLength) / 5280).toFixed(1));
  }
  /*Function doesn't seem to effect the display of the page check where it is called */
  getActiveMinutesByDate(id, date) {
    let userActivityByDate = this.getUserDatabyDate(id, date);
    return userActivityByDate.minutesActive;
  }
  /*Removing does not seem to effect the display seem to be a trend on this class
   */
  calculateActiveAverageForWeek(id, date, userRepo) {
    return parseFloat((userRepo.getWeekFromDate(date, id, this.activityData)
      .reduce((sum, elem) => {
        return sum += elem.minutesActive;
      }, 0) / 7).toFixed(1));
  }
  /* Again does not seem to effect web display maybe activity class was not used
  correctly or never made it in the project properly or is being analyzed else where
  function returns true if user accomplishes step goal*/
  accomplishStepGoal(id, date, userRepo) {
    let userStepsByDate = this.getUserDatabyDate(id, date);
    return (userStepsByDate.numSteps === userRepo.dailyStepGoal) ? true : false;
  }

  /* again no changes to the display, research how we are using our functionality
  function returns an array of dates goal was exceeded*/
  getDaysGoalExceeded(id, user) {
    return this.activityData.reduce((dates, data) => {
      if (id === data.userID && data.numSteps > user.dailyStepGoal) {
        dates.push(data.date);
      }
      return dates;
    },[]);
  }
  /* never made it into the display of page
  looks like code is working maybe another set of eyes can see a place to refactor it down
  I tried just reduce with failure could not seperate the user data needed*/
  getStairRecord(id) {
    return this.activityData
      .filter(data => id === data.userID)
      .reduce((record, user) => {
        return (user.flightsOfStairs > record) ? user.flightsOfStairs : record
      }, 0);
  }
  /* THIS FUNCTION DOES EFFECT THE PAGE, SEEMS TO BE WORKING, REMOVES ALMOST
  ALL USER DATA 
  changed name in property from relevantData to 
  dataPropertyName since it refers to the key of
  the data we are returning 
  this function can be completely rewriten to work across all
  the data classes*/

  getAllUserAverageForDay(date, userRepo, dataPropertyName) {
    let selectedDayData = userRepo.chooseDayDataForAllUsers(this.activityData, date);
    return parseFloat((selectedDayData.reduce((sum, average) => sum += average[dataPropertyName], 0) / selectedDayData.length).toFixed(1));
  }



  /*THIS FUNCTION ALSO IF REMOVED BREAKS THE PAGE DISPLAY 
  same as above this function can get writen to be utilized in all data classes*/
  userDataForToday(id, date, userRepo, relevantData) {
    let userData = userRepo.getDataFromUserID(id, this.data);
    return userData.find(data => data.date === date)[relevantData];
  }
  /*THIS FUNCTION REMOVES ALL DATA FROM DISPLAY USER INFO AND FRIEND INFO
  same as above another function that is probably being used in hydration and sleep as well*/
  userDataForWeek(id, date, userRepo, releventData) {
    return userRepo.getWeekFromDate(date, id, this.activityData).map(data => `${data.date}: ${data[releventData]}`);
  }

  // Friends
  // This whole section can probably be moved to another class 
  /*BREAKS ALL ACTITIVIY DATA FROM USER AND FRIENDS IF REMOVED*/
  getFriendsActivity(user, userRepo) {
    let data = this.activityData;
    let userDatalist = user.friends.map(friend => {
      return userRepo.getDataFromUserID(friend, data)
    });
    return userDatalist.reduce(function(arraySoFar, listItem) {
      return arraySoFar.concat(listItem);
    }, []);
  }

  /*SAME AS ABOVE
  could maybe create a friends class inside user class to do this
  since this.activity is called less than userRepo and the functions within themselves*/
  getFriendsAverageStepsForWeek(user, date, userRepo) {
    let friendsActivity = this.getFriendsActivity(user, userRepo);
    let timeline = userRepo.chooseWeekDataForAllUsers(friendsActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData(friendsActivity, date, 'numSteps', timeline)
  }
  /*FUNCTIONS AS IT SAYS, IF REMOVED REMOVES WINNER AND FRIENDS INFO
  only 'this' is a method called within the friends section*/
  showChallengeListAndWinner(user, date, userRepo) {
    let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
    return rankedList.map(listItem => {
      console.log(listItem)
      let userID = Object.keys(listItem)[0];
      console.log(userID)
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
  /* REMOVES 3 DAY STEP, INCREASING ACTIVITY FOR USER. REMOVES WEEKLY WINNER
  not really part of the friends functionality */
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



export default ActivityRepo;

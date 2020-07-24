import Repo from "./Repo";
import UserRepo from './UserRepo';

class ActivityRepo extends Repo {
  constructor(activityData) {
    super(activityData);
  }

  getMilesFromStepsByDate(id, date, users) {
    let user = users.findUserById(id);
    let userMiles = this.findById(id, date);
    return parseFloat(((userMiles.numSteps * user.strideLength) / 5280).toFixed(1));
  }

  // getActiveMinutesByDate(id, date) {
  //   let userActivityByDate = this.findById(id, date);
  //   return userActivityByDate.minutesActive;
  // } // this.findById

  accomplishStepGoal(id, date, users) {
    let user = users.findUserById(id);
    let userActivityByDate = this.findById(id, date);
    return (userActivityByDate.numSteps === user.dailyStepGoal) ? true : false;
  }

  getDaysGoalExceeded(id, users) {
    let user = users.findUserById(id);
    return this.data.reduce((dates, data) => {
      if (id === data.userID && data.numSteps > user.dailyStepGoal) {
        dates.push(data.date);
      }
      return dates;
    },[]);
  }
  
  getStairRecord(id) {
    return this.data
      .filter(data => id === data.userID)
      .reduce((record, user) => {
        return (user.flightsOfStairs > record) ? user.flightsOfStairs : record
      }, 0);
  } 


  // getAllUserAverageForDay(date, userRepo, dataPropertyName) {
  //   let selectedDayData = this.chooseDayDataForAllUsers(this.activityData, date);
  //   return parseFloat((selectedDayData.reduce((sum, average) => sum += average[dataPropertyName], 0) / selectedDayData.length).toFixed(1));
  // } // repo

  // userDataForWeek(id, date, userRepo, dataPropertyName) {
  //   return userRepo.getWeekFromDate(date, id, this.activityData).map(data => `${data.date}: ${data[dataPropertyName]}`);
  // } this.GETUSERDATABYWEEK()


  //moving to user repo ::

  
//   showChallengeListAndWinner(user, date, userRepo) {
//     let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
//     return rankedList.map(listItem => {
//       console.log(listItem)
//       let userID = Object.keys(listItem)[0];
//       console.log(userID)
//       let userName = userRepo.getDataFromID(parseInt(userID)).name;
//       return `${userName}: ${listItem[userID]}`
//     })
//   }

//   showcaseWinner(user, date, userRepo) {
//     let namedList = this.showChallengeListAndWinner(user, date, userRepo);
//     let winner = this.showChallengeListAndWinner(user, date, userRepo).shift();
//     return winner;
//   }

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

//   getWinnerId(user, date, userRepo) {
//     let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
//     let keysList = rankedList.map(listItem => Object.keys(listItem));
//     return parseInt(keysList[0].join(''))
//   }
// }

// MOV
}

export default ActivityRepo;

import Repo from "./Repo";

class ActivityRepo extends Repo {
  constructor(activityData) {
    super(activityData)
  }

  getMilesFromStepsByDate(id, date, users) {
    let user = users.findUserById(id);
    let userMiles = this.findById(id, date);
    return parseFloat(((userMiles.numSteps * user.strideLength) / 5280).toFixed(1));
  }

  getUserTotalMiles(id, users) {
    let user = users.findUserById(id);
    let allSteps = this.getAllDataById(id);
    let miles = allSteps.reduce((total, steps) => {
      return total + steps.numSteps;
    }, 0);
    return parseFloat(((miles * user.strideLength) / 5280).toFixed(1));
  }

  // getActiveMinutesByDate(id, date) {
  //   let userActivityByDate = this.findById(id, date);
  //   return userActivityByDate.minutesActive;
  // } // this.findById


  //need to add sad path if date or user is not defined
  accomplishedStepGoal(id, date, users) {
    let user = users.findUserById(id);
    let userActivityByDate = this.findById(id, date);
    return (userActivityByDate.numSteps > user.dailyStepGoal) ? `Keep it up ${user.name}, you crushed your goal` : `You got this ${user.name}, just a few more steps`;
  };

  remainingSteps(id, date, users) {
    let completeMessage = 'Step goal, crushed!, Keep it up!';
    let user = users.findUserById(id);
    let userActivityByDate = this.findById(id, date);
    if (userActivityByDate === undefined) {
      return `No step activity found for ${date}`
    }
    let steps = user.dailyStepGoal - userActivityByDate.numSteps;
    return (steps < 0) ? completeMessage : `You have ${steps} steps to go.`;
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
// method needs to check if day before meet goal, and check each date that made that goal until a goal wasn't made or a date was skipped, need to iterate all of the user data, data is sorted by most recent and needs to iterate until either a day is not concurrent or goal not made return index that the iteration stops at as the streak total days.

//reach for reduce if previousData meets goal and currentData meets goal add 1 if doesnt stop iterating and return streak number

  // currentStreak(id, activityData) {
  //   let userStreak = this.sortUserDataByDate(id);
  //   let dates = [];
  //   let streaks = userStreak.reduce((previous, streak) => {
  //     if(previous[activityData] < streak[activityData])
  //   });
  //   return streaks;
  // }

  getStreak(id, activityType) {
    let sortedUserArray = (this.sortUserDataByDate(id)).reverse();
    let streaks = sortedUserArray.filter((activity, index) => {
      if (index >= 2) {
        return (sortedUserArray[index - 2][activityType] < sortedUserArray[index - 1][activityType] && sortedUserArray[index - 1][activityType] < sortedUserArray[index][activityType])
      }
    });
    console.log(streaks)
    return streaks.map(streak => {
      return streak.date;
    })
  }
  
  getStairRecord(id) {
    return this.data
      .filter(data => id === data.userID)
      .reduce((record, user) => {
        return (user.flightsOfStairs > record) ? user.flightsOfStairs : record
      }, 0);
    }
  }

export default ActivityRepo;

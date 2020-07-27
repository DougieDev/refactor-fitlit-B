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

  getStreak(id, activityType) {
    let sortedUserArray = (this.sortUserDataByDate(id)).reverse();
    let streaks = sortedUserArray.filter((activity, index) => {
      if (index >= 2) {
        return (sortedUserArray[index - 2][activityType] < sortedUserArray[index - 1][activityType] && sortedUserArray[index - 1][activityType] < sortedUserArray[index][activityType])
      }
    });
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

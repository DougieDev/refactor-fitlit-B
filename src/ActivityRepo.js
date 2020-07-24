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

  getStreak(id, activityType) {
    let sortedUserArray = (this.sortUserDataByDate(id));
    sortedUserArray.reverse();
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

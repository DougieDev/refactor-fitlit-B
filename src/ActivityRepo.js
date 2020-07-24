import Repo from "./Repo";

class ActivityRepo extends Repo {
  constructor(activityData) {
    super(activityData);
  }

  getMilesFromStepsByDate(id, date) {
    let user = userRepo.findById(id);
    let userMiles = this.findById(id, date);
    return parseFloat(((userMiles.numSteps * user.strideLength) / 5280).toFixed(1));
  }

  accomplishStepGoal(date, id) {
    let user = userRepo.findUserById(id);
    let userActivityByDate = this.findById(id, date);
    return (userActivityByDate.numSteps === user.dailyStepGoal) ? true : false;
  }

  getDaysGoalExceeded(id) {
    let user = userRepo.findUserById(id);
    return this.activityData.reduce((dates, data) => {
      if (id === data.userID && data.numSteps > user.dailyStepGoal) {
        dates.push(data.date);
      }
      return dates;
    },[]);
  }

  getStreak(userRepo, id, relevantData) {
    let data = this.data;
    let sortedUserArray = (userRepo.makeSortedUserArray(id, data)).reverse();
    let streaks = sortedUserArray.filter(function (element, index) {
      if (index >= 2) {
        return (sortedUserArray[index - 2][relevantData] < sortedUserArray[index - 1][relevantData] && sortedUserArray[index - 1][relevantData] < sortedUserArray[index][relevantData])
      }
    });
    return streaks.map(function (streak) {
      return streak.date;
    })
  }
  
  getStairRecord(id) {
    return this.activityData
      .filter(data => id === data.userID)
      .reduce((record, user) => {
        return (user.flightsOfStairs > record) ? user.flightsOfStairs : record
      }, 0);
    }
  }

export default ActivityRepo;

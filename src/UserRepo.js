import Repo from './Repo'



class UserRepo extends Repo  {
  constructor(usersData) {
    super(usersData)
  }

  findUserById(id) {
    return this.data.find(dataPoint => dataPoint.id === id)
  }
  
  getTopPerformer(date, activityType, repo) {
    const winner = repo.getAllDataByDay(date);
    const topPerformer = winner.reduce((compare, currentValue) => {
      if (compare[activityType] > currentValue[activityType]) {
        return compare;
      } else {
        return currentValue;
      }
    });
    const user = this.findUserById(topPerformer.userID);
    topPerformer.name = user.name;
    topPerformer.activity = topPerformer[activityType];
    return topPerformer;
  }

  rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod) {
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(
      dataSet, 
      date, 
      relevantData, 
      listFromMethod
    )
    return Object.keys(sortedObjectKeys).sort((b, a) => {
      return (sortedObjectKeys[a].reduce((sumSoFar, sleepQualityValue) => {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / sortedObjectKeys[a].length) - (sortedObjectKeys[b].reduce((sumSoFar, sleepQualityValue) => {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / sortedObjectKeys[b].length)
    });
  }
  
  combineRankedUserIDsAndAveragedData(
    dataSet, 
    date, 
    relevantData, 
    listFromMethod
  ) {
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(
      dataSet, 
      date, 
      relevantData, 
      listFromMethod
    )
    let rankedUsersAndAverages = this.rankUserIDsbyRelevantDataValue(
      dataSet, 
      date, 
      relevantData, 
      listFromMethod
    )
    return rankedUsersAndAverages.map(rankedUser => {
      rankedUser = {
        [rankedUser]: sortedObjectKeys[rankedUser].reduce(
          (sumSoFar, sleepQualityValue) => {
            sumSoFar += sleepQualityValue
            return sumSoFar;
          }, 0) / sortedObjectKeys[rankedUser].length
      }
      return rankedUser;
    });
  }

  showChallengeListAndWinner(user, date) {
    let rankedList = user.getFriendsAverageStepsForWeek(date, this.data);
    return rankedList.map(listItem => {
      let userID = Object.keys(listItem)[0];
      let userName = this.data.findById(parseInt(userID)).name;
      return `${userName}: ${listItem[userID]}`
    })
  }

  showcaseWinner(user, date) {
    let winner = this.showChallengeListAndWinner(user, date).shift();
    return winner;
  }
}

export default UserRepo;

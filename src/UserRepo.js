import Repo from './Repo'
import User from './User';


class UserRepo extends Repo  {
  constructor(usersData) {
    super(usersData)
  }

  storeData(data) {
    if (Array.isArray(data)) {
      this.data = data;
      // this.findCurrentUser()
    }
  }

  findCurrentUser() {
    let index = this.getRandomNumber()
    let user = this.findUserById(index);
    this.currentUser = new User(user)
  }

  findUserById(id) {
    return this.data.find(user => user.id === id)
  }
  
  getRandomNumber() {
    return Math.floor(Math.random() * 4)
  }

  isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod) {
    return listFromMethod.reduce((objectSoFar, dataItem) => {
      if (!objectSoFar[dataItem.userID]) {
        objectSoFar[dataItem.userID] = [dataItem[relevantData]]
      } else {
        objectSoFar[dataItem.userID].push(dataItem[relevantData])
      }
      return objectSoFar;
    }, {});
  }

  rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod) {
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)
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

  combineRankedUserIDsAndAveragedData(dataSet, date, relevantData, listFromMethod) {
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)
    let rankedUsersAndAverages = this.rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod)
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

  determineBestSleepers(date, userRepo) {
    let timeline = userRepo.chooseWeekDataForAllUsers(this.data, date);
    let userSleepObject = userRepo.isolateUsernameAndRelevantData(this.data, date, 'sleepQuality', timeline);

    return Object.keys(userSleepObject).filter(function (key) {
      return (userSleepObject[key].reduce(function (sumSoFar, sleepQualityValue) {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / userSleepObject[key].length) > 3
    }).map(function (sleeper) {
      return userRepo.getDataFromID(parseInt(sleeper)).name;
    })
  }
}






export default UserRepo;

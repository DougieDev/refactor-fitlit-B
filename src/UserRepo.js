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
    let index = this.GetRandomNumber()
    let user = this.data.find(user => user.userId === index)
    this.currentUser = new User(user)
  }

  findUserById(id) {
    return this.data.find((dataPoint) => {
      return dataPoint.id === id;
    });
  }
  
  getRandomNumber() {
    return Math.floor(Math.random() * 50)
  }

  isolateUsernameAndRelevantData(relevantData, listFromMethod) {
    return listFromMethod.reduce((objectSoFar, dataItem) => {
      if (!objectSoFar[dataItem.userID]) {
        objectSoFar[dataItem.userID] = [dataItem[relevantData]]
      } else {
        objectSoFar[dataItem.userID].push(dataItem[relevantData])
      }
      return objectSoFar;
    }, {});
  }

  determineBestSleepers(date) {
    let timeline = this.data.chooseWeekDataForAllUsers(this.data, date);
    let userSleepObject = this.data.isolateUsernameAndRelevantData(this.data, date, 'sleepQuality', timeline);

    return Object.keys(userSleepObject).filter(function (key) {
      return (userSleepObject[key].reduce(function (sumSoFar, sleepQualityValue) {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / userSleepObject[key].length) > 3
    }).map(function (sleeper) {
      return this.data.findById(parseInt(sleeper)).name;
    })
  }

  determineSleepWinnerForWeek(date) {
    let timeline = this.data.chooseWeekDataForAllUsers(this.data, date);
    let sleepRankWithData = this.data.combineRankedUserIDsAndAveragedData(this.data, date, 'sleepQuality', timeline);

    return this.getSleepWinnerNamesFromList(sleepRankWithData, this.data);
  }
 
  determineSleepHoursWinnerForDay(date) {
    let timeline = this.data.chooseDayDataForAllUsers(this.data, date);
    let sleepRankWithData = this.data.combineRankedUserIDsAndAveragedData(this.data, date, 'hoursSlept', timeline);

    return this.getSleepWinnerNamesFromList(sleepRankWithData, this.data);
  }

  getSleepWinnerNamesFromList(sortedArray) {
    let bestSleepers = sortedArray.filter(function (element) {
      return element[Object.keys(element)] === Object.values(sortedArray[0])[0]
    });

    let bestSleeperIds = bestSleepers.map(function (bestSleeper) {
      return (Object.keys(bestSleeper));
    });

    return bestSleeperIds.map(function (sleepNumber) {
      return this.data.findById(parseInt(sleepNumber)).name;
    });
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
      return userRepo.findById(parseInt(sleeper)).name;
    })
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
    let namedList = this.showChallengeListAndWinner(user, date);
    let winner = this.showChallengeListAndWinner(user, date).shift();
    return winner;
  }

  getWinnerId(user, date) {
    let rankedList = user.getFriendsAverageStepsForWeek(user, date, this.data);
    let keysList = rankedList.map(listItem => Object.keys(listItem));
    return parseInt(keysList[0].join(''))
  }
}

export default UserRepo;

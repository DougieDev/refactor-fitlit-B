import Repo from './Repo'
import User from './User';
import { activityRepo } from './globals';



class UserRepo extends Repo  {
  constructor(usersData) {
    super(usersData)
    
  }

  findCurrentUser() {
    let index = this.getRandomNumber()
    let user = this.data.find(user => user.id === index)
    this.currentUser = new User(user)
  }

  findUserById(id) {
    return this.data.find((dataPoint) => {
      // console.log(typeof number)
      // if (id != typeof 'number') {
      //   console.log('DAS WRONG, BRUV!')
      // } else {
        return dataPoint.id === id;
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

/* BECAUSE OF THE findCurrentUser() METHOD, THIS HAD TO BE REFACTORED
SINCE THE RANDOM NUMBER WAS SOMETIMES THE SAME AS THE INDEX AND SOMETIMES NOT.
THIS WAS RESULTING IN THE TEST PASSING SOMETIMES AND FAILING OTHER TIMES.*/
  getRandomNumber() {
    let randomNum = Math.floor(Math.random() * (3 - 1) + 1)
    return randomNum

  }

  getTopPerformer(date, activityType, repo) {
    const winnerData = repo.getAllDataByDay(date);
    let topPerformer = winnerData.reduce((compare, currentValue) => {
      return (compare[activityType] > currentValue[activityType] ? compare : currentValue);
    });
    const user = this.findUserById(topPerformer.userID);

    topPerformer = {
      name: user.name,
      activity: topPerformer[activityType]
    }
    // topPerformer.name = user.name;
    // topPerformer.activity = topPerformer[activityType];
    console.log(topPerformer);
    return topPerformer;
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

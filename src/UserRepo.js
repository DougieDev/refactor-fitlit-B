import Repo from './Repo'
import User from './User';


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



/* BECAUSE OF THE findCurrentUser() METHOD, THIS HAD TO BE REFACTORED
SINCE THE RANDOM NUMBER WAS SOMETIMES THE SAME AS THE INDEX AND SOMETIMES NOT.
THIS WAS RESULTING IN THE TEST PASSING SOMETIMES AND FAILING OTHER TIMES.*/
  getRandomNumber() {
    let randomNum = Math.floor(Math.random() * (3 - 1) + 1)
    return randomNum
  }
  
/*WHAT IS THIS DOING? WHERE IS IT BEING USED?*/
//   isolateUsernameAndRelevantData(relevantData, listFromMethod) {
//     console.log(listFromMethod)
//     return listFromMethod.reduce((objectSoFar, dataItem) => {
//       if (!objectSoFar[dataItem.userID]) {
//         objectSoFar[dataItem.userID] = [dataItem[relevantData]]
//       } else {
//         objectSoFar[dataItem.userID].push(dataItem[relevantData])
//       }
//       return objectSoFar;
//     }, {});
//   }
// /* NOT BEING USED IN SCRIPTS OR PAGE-MANIP*/
//   determineBestSleepers(date) {
//     let timeline = this.data.chooseWeekDataForAllUsers(this.data, date);
//     let userSleepObject = this.data.isolateUsernameAndRelevantData(this.data, date, 'sleepQuality', timeline);
//
//     return Object.keys(userSleepObject).filter(function (key) {
//       return (userSleepObject[key].reduce(function (sumSoFar, sleepQualityValue) {
//         sumSoFar += sleepQualityValue
//         return sumSoFar;
//       }, 0) / userSleepObject[key].length) > 3
//     }).map(function (sleeper) {
//       return this.data.findById(parseInt(sleeper)).name;
//     })
//   }
// /* NOT BEING USED IN PAGE-MANIP OR SCRIPTS */
//   determineSleepWinnerForWeek(date) {
//     let timeline = this.data.chooseWeekDataForAllUsers(this.data, date);
//     let sleepRankWithData = this.data.combineRankedUserIDsAndAveragedData(this.data, date, 'sleepQuality', timeline);
//
//     return this.getSleepWinnerNamesFromList(sleepRankWithData, this.data);
//   }
// /* NOT BEING USED IN PAGE-MANIP OR SCRIPTS */
//   determineSleepHoursWinnerForDay(date) {
//     let timeline = this.data.chooseDayDataForAllUsers(this.data, date);
//     let sleepRankWithData = this.data.combineRankedUserIDsAndAveragedData(this.data, date, 'hoursSlept', timeline);
//
//     return this.getSleepWinnerNamesFromList(sleepRankWithData, this.data);
//   }
//   /* NOT BEING USED IN PAGE-MANIP OR SCRIPTS*/
//   getSleepWinnerNamesFromList(sortedArray) {
//     let bestSleepers = sortedArray.filter(function (element) {
//       return element[Object.keys(element)] === Object.values(sortedArray[0])[0]
//     });
//
//     let bestSleeperIds = bestSleepers.map(function (bestSleeper) {
//       return (Object.keys(bestSleeper));
//     });
//
//     return bestSleeperIds.map(function (sleepNumber) {
//       return this.data.findById(parseInt(sleepNumber)).name;
//     });
//   }
// /* NOT BEING USED IN PAGE-MANIP OR SCRIPTS*/
//   rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod) {
//     let sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)
//     return Object.keys(sortedObjectKeys).sort((b, a) => {
//       return (sortedObjectKeys[a].reduce((sumSoFar, sleepQualityValue) => {
//         sumSoFar += sleepQualityValue
//         return sumSoFar;
//       }, 0) / sortedObjectKeys[a].length) - (sortedObjectKeys[b].reduce((sumSoFar, sleepQualityValue) => {
//         sumSoFar += sleepQualityValue
//         return sumSoFar;
//       }, 0) / sortedObjectKeys[b].length)
//     });
//   }
// /* NOT BEING USED IN PAGE-MANIP OR SCRIPTS */
//   combineRankedUserIDsAndAveragedData(dataSet, date, relevantData, listFromMethod) {
//     let sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)
//     let rankedUsersAndAverages = this.rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod)
//     return rankedUsersAndAverages.map(rankedUser => {
//       rankedUser = {
//         [rankedUser]: sortedObjectKeys[rankedUser].reduce(
//           (sumSoFar, sleepQualityValue) => {
//             sumSoFar += sleepQualityValue
//             return sumSoFar;
//           }, 0) / sortedObjectKeys[rankedUser].length
//       }
//       return rankedUser;
//     });
//   }

/* NOT BEING USED IN SCRIPTS OR PAGE-MANIP */
  // getWinnerId(user, date) {
  //   let rankedList = user.getFriendsAverageStepsForWeek(user, date, this.data);
  //   let keysList = rankedList.map(listItem => Object.keys(listItem));
  //   return parseInt(keysList[0].join(''))
  // }

/* WHILE THE BELOW METHODS ARE BEING USED IN PAGE-MANIP,
THEY DO NOT APPEAR TO BE IN A SECTION THAT WE ARE DISPLAYING ANYMORE.
IS THIS NECESSARY? */

/* BEING USED IN page-manip*/

  showChallengeListAndWinner(user, date) {
    let rankedList = user.getFriendsAverageStepsForWeek(date, this.data);
    return rankedList.map(listItem => {
      let userID = Object.keys(listItem)[0];
      let userName = this.data.findById(parseInt(userID)).name;
      return `${userName}: ${listItem[userID]}`
    })
  }

/* BEING USED IN page-manip */
  showcaseWinner(user, date) {
    // let namedList = this.showChallengeListAndWinner(user, date);
    let winner = this.showChallengeListAndWinner(user, date).shift();
    return winner;
  }
}

export default UserRepo;

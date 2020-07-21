// import './css/base.scss';
import './css/style.scss';

import './images/person walking on path.jpg';
import './images/arnie.jpg';

// import userData from './data/users'

import hydrationData from './data/hydration';
import sleepData from './data/sleep';
import activityData from './data/activity';
import Fitlit from './Fitlit';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';

import HydrationRepo from './HydrationRepo'

import {
  populateDailyData,
  addInfoToUserSidebar, 
  addFriendSidebar
} from './page-manipulation';

function catchData(src) {
  let parent = findParentUrl(src);
  return fetch(`https://fe-apps.herokuapp.com/api/v1/fitlit/1908/${parent}/${src}`)
    .then(response => response.json())
    .then(data => data[src])
}

function findParentUrl(src) {
  if (src.includes('user')) {
    return 'users'
  } else if (src.includes('sleep')) {
    return 'sleep'
  } else if (src.includes('activity')) {
    return 'activity'
  } else if (src.includes('hydration')) {
    return 'hydration'
  }
}

let hydrationRepo;

let rawUserData = catchData('userData');
let rawSleepData = catchData('sleepData');
let rawActivityData = catchData('activityData');
let rawHydrationData = catchData('hydrationData').then(data => new HydrationRepo(data));

Promise.all([rawHydrationData, rawActivityData])
  .then(data => console.log(data))
  




// function startApp() {
//   var historicalWeek = document.querySelectorAll('.historicalWeek');
  
//   let userList = [];
//   // makeUsers(userList);
//   let userRepo = new UserRepo(userList);
//   let hydrationRepo = new Hydration(hydrationData);
//   let sleepRepo = new Sleep(sleepData);
//   let activityRepo = new Activity(activityData);
//   var userNowId = pickUser();
//   let userNow = getUserById(userNowId, userRepo);
//   let today = makeToday(userRepo, userNowId, hydrationData);
//   let randomHistory = makeRandomDate(userRepo, userNowId, hydrationData);
//   historicalWeek.forEach(instance => instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`));
//   addInfoToUserSidebar(userNow, userRepo);
//   ;
//   populateDailyData('activity-today', activityRepo, userNow.id, today);
//   populateDailyData('sleep-today', sleepRepo, userNow.id, today);
//   let winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
// }



// function makeUsers(array) {
//   const userData = catchData('userData');
//   userData.forEach(function(dataItem) {
//     let user = new User(dataItem);
//     array.push(user);
//   })
// }

// function pickUser() {
//   return Math.floor(Math.random() * 50);
// }

// function getUserById(id, listRepo) {
//   return listRepo.getDataFromID(id);
// };

// function makeWinnerID(activityInfo, user, dateString, userStorage){
//   return activityInfo.getWinnerId(user, dateString, userStorage)
// }

// function makeToday(userStorage, id, dataSet) {
//   var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
//   return sortedArray[0].date;
// }

// function makeRandomDate(userStorage, id, dataSet) {
//   var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
//   return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date
// }



// startApp();
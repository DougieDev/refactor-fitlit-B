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
import HydrationRepo from './Hydration-repo'
import ActivityRepo from './Activity-repo'
import SleepRepo from './Sleep-repo'


import {
  populateDailyData,
  addInfoToUserSidebar, 
  addFriendSidebar
} from './page-manipulation';

function catchData(src) {

  let parent = findParentUrl(src);
  return fetch(`https://fe-apps.herokuapp.com/api/v1/fitlit/1908/${parent}/${src}`)
    .then(response => response.json())
    .then(data => data[src]);
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

const data = {
  users: catchData('userData'),
  hydration: (catchData('hydrationData')),
  activity: catchData('activityData'),
  sleep: catchData('sleepData')
};

Promise.allSettled([data.users, data.sleep, data.activity, data.hydration])
  .then(rawData => {
    data.users = new UserRepo(rawData[0].value)
    data.sleep = new SleepRepo(rawData[1].value)
    data.activity = new ActivityRepo(rawData[2].value)
    data.hydration = new HydrationRepo(rawData[3].value)
  })
  // .then(result => console.log(result))
  .then(startApp());

function startApp() {
console.log(data);
//   var historicalWeek = document.querySelectorAll('.historicalWeek');
  var userNowId = pickUser();
  let userNow = getUserById(userNowId);
  // let today = makeToday(userNow);
//   let randomHistory = makeRandomDate(userRepo, userNowId, hydrationData);
//   historicalWeek.forEach(instance => instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`));
//   addInfoToUserSidebar(userNow, userRepo);
//   ;
//   populateDailyData('activity-today', activityRepo, userNow.id, today);
//   populateDailyData('sleep-today', sleepRepo, userNow.id, today);
//   let winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
}

function pickUser() {
  return Math.floor(Math.random() * 50);
}

function getUserById(id) {
  return data.users.then(data => data.find(user => user.id === id));
};

// function makeWinnerID(activityInfo, user, dateString, userStorage){
//   return activityInfo.getWinnerId(user, dateString, userStorage)
// }

// function makeToday(userNow) {
//   return Promise.allSettled([data.hydration, data.users, userNow])
//     .then(data => data[1].value.makeSortedUserArray(userNow.id, data[0].date))
//     .then(result => console.log(result))
//     .then(sortedArray => sortedArray[0].date);


// function makeRandomDate(userStorage, id, dataSet) {
//   var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
//   return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date
// }



// startApp();
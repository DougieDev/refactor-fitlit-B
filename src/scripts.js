// import './css/base.scss';
import './css/style.scss';

import './images/person walking on path.jpg';
import './images/arnie.jpg';





// import userData from './data/users';
import hydrationData from './data/hydration';
import sleepData from './data/sleep';
import activityData from './data/activity';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';

import {
  addInfoToUserSidebar, 
  addHydrationInfo, 
  addSleepInfo, 
  addActivityInfo, 
  addFriendSidebar
} from './page-manipulation';

async function startApp() {
  var historicalWeek = document.querySelectorAll('.historicalWeek');

  let userList = [];
  await makeUsers(userList);
  let userRepo = new UserRepo(userList);
  let hydrationRepo = new Hydration(hydrationData);
  let sleepRepo = new Sleep(sleepData);
  let activityRepo = new Activity(activityData);
  var userNowId = pickUser();
  let userNow = getUserById(userNowId, userRepo);
  let today = makeToday(userRepo, userNowId, hydrationData);
  let randomHistory = makeRandomDate(userRepo, userNowId, hydrationData);
  historicalWeek.forEach(instance => instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`));
  // addInfoToUserSidebar(userNow, userRepo);
  addHydrationInfo(userNowId, hydrationRepo, today, userRepo, randomHistory);
  addSleepInfo(userNowId, sleepRepo, today, userRepo, randomHistory);
  let winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
  addActivityInfo(userNowId, activityRepo, today, userRepo, randomHistory, userNow, winnerNow);
  // addFriendSidebar(userNowId, activityRepo, userRepo, today, randomHistory, userNow);
}

async function catchData(id) {
  const response = await fetch(`https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/${id}`)
  const data = await response.json();
  const arrayData = await data[id];
  return await arrayData
}

async function makeUsers(array) {
  const userData = await catchData('userData');
  userData.forEach(function(dataItem) {
    let user = new User(dataItem);
    array.push(user);
  })
}

function pickUser() {
  return Math.floor(Math.random() * 50);
}

function getUserById(id, listRepo) {
  return listRepo.getDataFromID(id);
};

function makeWinnerID(activityInfo, user, dateString, userStorage){
  return activityInfo.getWinnerId(user, dateString, userStorage)
}

function makeToday(userStorage, id, dataSet) {
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[0].date;
}

function makeRandomDate(userStorage, id, dataSet) {
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date
}



startApp();
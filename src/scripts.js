// import './css/base.scss';
import './css/style.scss';

import './images/person walking on path.jpg';
import './images/The Rock.jpg';

import userData from './data/users';
import hydrationData from './data/hydration';
import sleepData from './data/sleep';
import activityData from './data/activity';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';



function startApp() {
  var historicalWeek = document.querySelectorAll('.historicalWeek');

  let userList = [];
  makeUsers(userList);
  let userRepo = new UserRepo(userList);
  let hydrationRepo = new Hydration(hydrationData);
  let sleepRepo = new Sleep(sleepData);
  let activityRepo = new Activity(activityData);
  var userNowId = pickUser();
  let userNow = getUserById(userNowId, userRepo);
  let today = makeToday(userRepo, userNowId, hydrationData);
  let randomHistory = makeRandomDate(userRepo, userNowId, hydrationData);
  historicalWeek.forEach(instance => instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`));
  addInfoToUserSidebar(userNow, userRepo);
  addHydrationInfo(userNowId, hydrationRepo, today, userRepo, randomHistory);
  addSleepInfo(userNowId, sleepRepo, today, userRepo, randomHistory);
  let winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
  addActivityInfo(userNowId, activityRepo, today, userRepo, randomHistory, userNow, winnerNow);
  addFriendGameInfo(userNowId, activityRepo, userRepo, today, randomHistory, userNow);
}

function makeUsers(array) {
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

function addInfoToUserSidebar(user, userStorage) {
  const sidebar = document.getElementById('user-sidebar');
  const headerText = document.getElementById('headerText');
  const leftSidebarHtmlBlock = 
    `<h2 class="sidebar-header-name" id="sidebarName">${user.name}</h2>
    <div class="sidebar-header-line"></div>
    <img src="./images/The Rock.jpg" class="sidebar-header-userImage"></img>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-header-userInfo" id="userAddress">${user.address}</p>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-header-userInfo" id="userEmail">${user.email}</p>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-header-userInfo" id="userStridelength">
      Your stride length is ${user.strideLength} meters.
    </p>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-header-userInfo" id="stepGoalCard">Your daily step goal is ${user.dailyStepGoal}</p>
    <p class="sidebar-header-userInfo" id="avStepGoalCard">
      The average daily step goal is ${userStorage.calculateAverageStepGoal()}
    <p>
    <div class="sidebar-header-line"></div>
    <section class="sidebar-body-friendContainer">
      <p class="sidebar-header-userInfo">Friends</p>
      <section class="sidebar-friendContainer-listItems">
        <ul class="card-vertical-list" id="friendList">
          <!-- friend list goes here -->
        </ul>
      </section>
      <div class="sidebar-header-line"></div>
      <p class="thisWeek">Keep up the good work! You were increasingly active on these dates:</p>
      <ul class="card-vertical-list" id="streakListMinutes">
        <!-- friend list goes here -->
      </ul>
    </section>`;
  
  sidebar.innerHTML = leftSidebarHtmlBlock; 
  headerText.innerText = `${user.getFirstName()}'s Activity Tracker`;
    // the following should be refactored so that `makeStepStreakHtml` can be inserted straight into the HTML. 
  var friendList = document.getElementById('friendList');
  friendList.insertAdjacentHTML('afterBegin', makeFriendHTML(user, userStorage))
};

function makeFriendHTML(user, userStorage) {
  return user.getFriendsNames(userStorage).map(friendName => `<li class='historical-list-listItem'>${friendName}</li>`).join('');
}

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

function addHydrationInfo(id, hydrationInfo, dateString, userStorage, laterDateString) {
  const hydrationToday = document.getElementById('hydrationToday');
  const hydrationAverage = document.getElementById('hydrationAverage');
  const hydrationThisWeek = document.getElementById('hydrationThisWeek');
  const hydrationEarlierWeek = document.getElementById('hydrationEarlierWeek');

  hydrationToday.insertAdjacentHTML('afterBegin', `<p>You drank</p><p><span class="number">${hydrationInfo.calculateDailyOunces(id, dateString)}</span></p><p>oz water today.</p>`);
  hydrationAverage.insertAdjacentHTML('afterBegin', `<p>Your average water intake is</p><p><span class="number">${hydrationInfo.calculateAverageOunces(id)}</span></p> <p>oz per day.</p>`)
  hydrationThisWeek.insertAdjacentHTML('afterBegin', makeHydrationHTML(id, hydrationInfo, userStorage, hydrationInfo.calculateFirstWeekOunces(userStorage, id)));
  hydrationEarlierWeek.insertAdjacentHTML('afterBegin', makeHydrationHTML(id, hydrationInfo, userStorage, hydrationInfo.calculateRandomWeekOunces(laterDateString, id, userStorage)));
}

function makeHydrationHTML(id, hydrationInfo, userStorage, method) {
  return method.map(drinkData => `<li class="historical-list-listItem">On ${drinkData}oz</li>`).join('');
}

function addSleepInfo(id, sleepInfo, dateString, userStorage, laterDateString) {
  const sleepToday = document.getElementById('sleepToday');
  const sleepQualityToday = document.getElementById('sleepQualityToday');
  const avUserSleepQuality = document.getElementById('avUserSleepQuality');
  const sleepThisWeek = document.getElementById('sleepThisWeek');
  const sleepEarlierWeek = document.getElementById('sleepEarlierWeek');

  sleepToday.insertAdjacentHTML("afterBegin", `<p>You slept</p> <p><span class="number">${sleepInfo.calculateDailySleep(id, dateString)}</span></p> <p>hours today.</p>`);
  sleepQualityToday.insertAdjacentHTML("afterBegin", `<p>Your sleep quality was</p> <p><span class="number">${sleepInfo.calculateDailySleepQuality(id, dateString)}</span></p><p>out of 5.</p>`);
  avUserSleepQuality.insertAdjacentHTML("afterBegin", `<p>The average user's sleep quality is</p> <p><span class="number">${Math.round(sleepInfo.calculateAllUserSleepQuality() *100)/100}</span></p><p>out of 5.</p>`);
  sleepThisWeek.insertAdjacentHTML('afterBegin', makeSleepHTML(id, sleepInfo, userStorage, sleepInfo.calculateWeekSleep(dateString, id, userStorage)));
  sleepEarlierWeek.insertAdjacentHTML('afterBegin', makeSleepHTML(id, sleepInfo, userStorage, sleepInfo.calculateWeekSleep(laterDateString, id, userStorage)));
}

function makeSleepHTML(id, sleepInfo, userStorage, method) {
  return method.map(sleepData => `<li class="historical-list-listItem">On ${sleepData} hours</li>`).join('');
}

function makeSleepQualityHTML(id, sleepInfo, userStorage, method) {
  return method.map(sleepQualityData => `<li class="historical-list-listItem">On ${sleepQualityData}/5 quality of sleep</li>`).join('');
}

function addActivityInfo(id, activityInfo, dateString, userStorage, laterDateString, user, winnerId) {

  const userStepsToday = document.getElementById('userStepsToday');
  const avgStepsToday = document.getElementById('avgStepsToday');
  const userStairsToday = document.getElementById('userStairsToday');
  const avgStairsToday = document.getElementById('avgStairsToday');
  const userMinutesToday = document.getElementById('userMinutesToday');
  const avgMinutesToday = document.getElementById('avgMinutesToday');
  const userStepsThisWeek = document.getElementById('userStepsThisWeek');
  const userStairsThisWeek = document.getElementById('userStairsThisWeek');
  const userMinutesThisWeek = document.getElementById('userMinutesThisWeek');
  const bestUserSteps = document.getElementById('bestUserSteps');

  userStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count:</p><p>You</><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'flightsOfStairs')}</span></p>`)
  avgStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count: </p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'flightsOfStairs')}</span></p>`)
  userStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'numSteps')}</span></p>`)
  avgStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'numSteps')}</span></p>`)
  userMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'minutesActive')}</span></p>`)
  avgMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'minutesActive')}</span></p>`)
  userStepsThisWeek.insertAdjacentHTML("afterBegin", makeStepsHTML(id, activityInfo, userStorage, activityInfo.userDataForWeek(id, dateString, userStorage, "numSteps")));
  userStairsThisWeek.insertAdjacentHTML("afterBegin", makeStairsHTML(id, activityInfo, userStorage, activityInfo.userDataForWeek(id, dateString, userStorage, "flightsOfStairs")));
  userMinutesThisWeek.insertAdjacentHTML("afterBegin", makeMinutesHTML(id, activityInfo, userStorage, activityInfo.userDataForWeek(id, dateString, userStorage, "minutesActive")));
  bestUserSteps.insertAdjacentHTML("afterBegin", makeStepsHTML(user, activityInfo, userStorage, activityInfo.userDataForWeek(winnerId, dateString, userStorage, "numSteps")));
}

function makeStepsHTML(id, activityInfo, userStorage, method) {
  return method.map(activityData => `<li class="historical-list-listItem">On ${activityData} steps</li>`).join('');
}

function makeStairsHTML(id, activityInfo, userStorage, method) {
  return method.map(data => `<li class="historical-list-listItem">On ${data} flights</li>`).join('');
}

function makeMinutesHTML(id, activityInfo, userStorage, method) {
  return method.map(data => `<li class="historical-list-listItem">On ${data} minutes</li>`).join('');
}

function addFriendGameInfo(id, activityInfo, userStorage, dateString, laterDateString, user) {
  const sidebar = document.getElementById('friends-sidebar');
  const rightSidebarHtmlBlock = `
    <h2 class="sidebar-header-name" id="sidebarName">FRIENDLY STEP CHALLENGE!</h2>
    <div class="sidebar-header-line"></div>
    <img src="./images/person walking on path.jpg" class="sidebar-header-userImage"></img>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-header-userInfo" id="bigWinner">
      THIS WEEK'S WINNER! ${activityInfo.showcaseWinner(user, dateString, userStorage)} steps
    </p>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-header-userInfo" id="stepGoalCard"></p>
    <p class="sidebar-header-userInfo" id="avStepGoalCard">
    <p>
    <section class="sidebar-body-friendContainer">
      <section class="sidebar-friendContainer-listItems">
        <p class="thisWeek">Rank this week</p>
        <ul class="card-vertical-list" id="friendChallengeListToday">
          ${makeFriendChallengeHTML(id, activityInfo, userStorage, activityInfo.showChallengeListAndWinner(user, dateString, userStorage))}
        </ul>
        <div class="sidebar-header-line"></div>
        <p class="historicalWeek">- Historical Rank</p>
        <ul class="card-vertical-list" id="friendChallengeListHistory">
          ${makeFriendChallengeHTML(id, activityInfo, userStorage, activityInfo.showChallengeListAndWinner(user, dateString, userStorage))}
        </ul>
        <div class="sidebar-header-line"></div>
      </section>
      <p class="thisWeek">You had 3 DAY STEP STREAKS on these days:</p>
      <ul class="card-vertical-list" id="streakList">
        ${makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'numSteps'))}
      </ul>
    </section>`;
  sidebar.innerHTML = rightSidebarHtmlBlock;
  // the following is intended to impact the right sidebar. when relocated it breaks the site. 
  // the following should be refacotred so that `makeStepStreakHtml` can be inserted straight into the HTML. 
  const streakListMinutes = document.getElementById('streakListMinutes')
  streakListMinutes.insertAdjacentHTML("afterBegin", makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'minutesActive'))); 
}

function makeFriendChallengeHTML(id, activityInfo, userStorage, method) {
  return method.map(friendChallengeData => `<li class="historical-list-listItem">Your friend ${friendChallengeData} average steps.</li>`).join('');
}

function makeStepStreakHTML(id, activityInfo, userStorage, method) {
  return method.map(streakData => `<li class="historical-list-listItem">${streakData}!</li>`).join('');
}

startApp();
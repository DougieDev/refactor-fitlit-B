// function makeStepsHTML(id, activityInfo, userStorage, method) {
//   return method.map((activityData) => {
//       return `<li class="historical-list-listItem">On ${activityData} steps</li>`;
//     }).join("");
// }

// function makeStairsHTML(id, activityInfo, userStorage, method) {
//   return method.map((data) => {
//       return `<li class="historical-list-listItem">On ${data} flights</li>`;
//     }).join("");
// }

// function makeMinutesHTML(id, activityInfo, userStorage, method) {
//   return method.map((data) => {
//       return `<li class="historical-list-listItem">On ${data} minutes</li>`;
//     }).join("");
// }

// function makeSleepHTML(id, sleepInfo, userStorage, method) {
//   return method.map((sleepData) => {
//       return `<li class="historical-list-listItem">On ${sleepData} hours</li>`;
//     }).join("");
// }

// function makeSleepQualityHTML(id, sleepInfo, userStorage, method) {
//   return method.map((sleepQualityData) => {
//       return `<li class="historical-list-listItem">On ${sleepQualityData}/5 quality of sleep</li>`;
//     }).join("");
// }

// function makeHydrationHTML(id, hydrationInfo, userStorage, method) {
//   return method.map(
//       (drinkData) =>
//         `<li class="historical-list-listItem">On ${drinkData}oz</li>`
//     ).join("");
// }

function populateDailyData(card, repo, userId, date) {
  const location = document.getElementById(card);
  const innerElements = location.children[0].children;
  for(var i = 0; i < innerElements.length; i++) {
    if (innerElements[i].classList.contains('number') && innerElements[i].id.includes('average')) {
      let key = innerElements[i].id.split('-')[0]
      innerElements[i].innerText = repo.calculateAverage(userId, key);
    } else if (innerElements[i].classList.contains('number')) {
      innerElements[i].innerText = repo.getData(userId, date, innerElements[i].id);
    }
  }
}



function makeFriendHTML(user, userStorage) {
  return user.getFriendsNames(userStorage).map((friendName) => {
      return `<li class='historical-list-listItem'>${friendName}</li>`;
    }).join("");
}

function makeFriendChallengeHTML(id, activityInfo, userStorage, method) {
  return method.map(friendChallengeData => {
    return `<li class="historical-list-listItem">Your friend ${friendChallengeData} average steps.</li>`
  }).join('');
}

function makeStepStreakHTML(id, activityInfo, userStorage, method) {
  return method.map(streakData => {
    return `<li class="historical-list-listItem">${streakData}!</li>`
  }).join('');
}

function addTodaysActivity(id, activityInfo, dateString, userStorage, laterDateString, user, winnerId) {
  const activityToday = document.querySelector('#activity-today');
  const activityTodayHtml = `
      <section class="horizontalCard-activity-container">
        <div class="card-today-activity">
          <p id="userStepsToday">
          <p>Your Step Count Today:</p>
            <p>
              <span class="number">
                ${activityInfo.userDataForToday(id, dateString, userStorage, 'numSteps')}
              </span>
            </p>
          </p>
        </div>

      </section>
      <section class="horizontalCard-activity-container">
        <div class="card-today-activity">
          <p id="userStairsToday">
            <p>Your Stair Count Today:</p>
            <p>
            <span class="number">
              ${activityInfo.userDataForToday(id, dateString, userStorage, 'flightsOfStairs')}
            </span>
            </p>
          </p>
        </div>
      </section>
      <section class="horizontalCard-activity-container">
        <div class="card-today-activity">
          <p id="userMinutesToday">
            <p>Your Minutes Active Today:</p>
            <p>
              <span class="number">
              ${activityInfo.userDataForToday(id, dateString, userStorage, 'minutesActive')}
              </span>
            </p>
          </p>
        </div>
      </section>`
  activityToday.insertAdjacentHTML('afterbegin', activityTodayHtml);
}


function addTodaysHydration(id, hydrationInfo, dateString, userStorage, laterDateString) {
  const hydrationToday = document.querySelector('#hydration-today');
  const hydrationTodayHtml = ` 
      <div class="card-today-hydration">
        <p id="hydrationToday">
          <p>You drank</p>
          <p>
            <span class="number">
              ${hydrationInfo.getData(id, dateString, `numOunces`)}
            </span>
          </p>
          <p>oz water today.</p>
        </p>
      </div>
      <div class="card-today-hydration">
        <p id="hydrationAverage">
          <p>Your average water intake is</p>
          <p>
            <span class="number">
              ${hydrationInfo.calculateAverageOunces(id)}
            </span>
          </p>
          <p>oz per day.</p>
        </p>
      </div>`
  hydrationToday.insertAdjacentHTML('afterbegin', hydrationTodayHtml);
}

function addTodaysSleep(id, sleepInfo, dateString, userStorage, laterDateString) {
  const sleepToday = document.querySelector('#sleep-today');
  const sleepTodayHtml = `
    <div class="card-today-sleep">
      <p id="sleepToday">
        <p>You slept</p> 
        <p>
          <span class="number">
            ${sleepInfo.calculateDailySleep(id, dateString)}
          </span>
        </p> 
        <p>hours today.</p>
      </p>
    </div>
    <div class="card-today-sleep">
      <p id="sleepQualityToday">
        <p>Your sleep quality was</p> 
        <p>
          <span class="number">
            ${sleepInfo.calculateDailySleepQuality(id, dateString)}
          </span>
        </p>
        <p>out of 5.</p>
      </p>
    </div>
    `
 
  sleepToday.insertAdjacentHTML('afterbegin', sleepTodayHtml);
}

function addInfoToUserSidebar(user, userStorage) {
  const sidebar = document.getElementById('user-sidebar');
  const headerText = document.getElementById('headerText');
  const accountInfo = document.getElementById('account-info');
  const userGoals = document.getElementById('user-goals');
  const accountInfoHtml = `
    <p class="sidebar-header-userInfo" id="userAddress">${user.address}</p>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-header-userInfo" id="userEmail">${user.email}</p>`

  const userGoalsHtml = `
    <p class="sidebar-header-userInfo" id="userStridelength">
      Your stride length is ${user.strideLength} meters.
    </p>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-header-userInfo" id="stepGoalCard">
      Your daily step goal is ${user.dailyStepGoal}
    </p>
    <p class="sidebar-header-userInfo" id="avStepGoalCard">
      The average daily step goal is ${userStorage.calculateAverageStepGoal()}
    <p>`

  const leftSidebarHtmlBlock = `
    <div class="sidebar-header-line"></div>
    <section class="sidebar-body-friendContainer">
      <p class="sidebar-header-userInfo">Friends</p>
      <section class="sidebar-friendContainer-listItems">
        <ul class="card-vertical-list" id="friendList">
          ${makeFriendHTML(user, userStorage)}
        </ul>
      </section>
      <div class="sidebar-header-line"></div>
      <p class="thisWeek">
        Keep up the good work! You were increasingly active on these dates:
      </p>
      <ul class="card-vertical-list" id="streakListMinutes">
        <!-- friend list goes here -->
      </ul>
    </section>`;
  headerText.insertAdjacentHTML('afterbegin', `${user.name}'s `);
  accountInfo.insertAdjacentHTML('beforeend', accountInfoHtml);
  sidebar.insertAdjacentHTML('beforeend', leftSidebarHtmlBlock);
  userGoals.insertAdjacentHTML('beforeend', userGoalsHtml);
}

function addFriendSidebar(id, activityInfo, userStorage, dateString, laterDateString, user) {
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
          ${makeFriendChallengeHTML(
            id, 
            activityInfo, 
            userStorage, 
            activityInfo.showChallengeListAndWinner(user, dateString, userStorage))}
        </ul>
        <div class="sidebar-header-line"></div>
        <p class="historicalWeek">- Historical Rank</p>
        <ul class="card-vertical-list" id="friendChallengeListHistory">
          ${makeFriendChallengeHTML(
            id, 
            activityInfo, 
            userStorage, 
            activityInfo.showChallengeListAndWinner(user, dateString, userStorage))}
        </ul>
        <div class="sidebar-header-line"></div>
      </section>
      <p class="thisWeek">You had 3 DAY STEP STREAKS on these days:</p>
      <ul class="card-vertical-list" id="streakList">
        ${makeStepStreakHTML(
          id, 
          activityInfo, 
          userStorage, 
          activityInfo.getStreak(userStorage, id, 'numSteps'))}
      </ul>
    </section>`;
  sidebar.innerHTML = rightSidebarHtmlBlock;
  const streakListMinutes = document.getElementById('streakListMinutes')
  streakListMinutes.insertAdjacentHTML("afterBegin", 
    makeStepStreakHTML(
      id, 
      activityInfo, 
      userStorage, 
      activityInfo.getStreak(userStorage, id, 'minutesActive')
    )
  );
}




export {populateDailyData, addInfoToUserSidebar, addTodaysHydration, addTodaysSleep, addTodaysActivity, addFriendSidebar}
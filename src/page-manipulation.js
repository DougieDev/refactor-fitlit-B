function makeFriendHTML(user, userStorage) {
  return user.getFriendsNames(userStorage).map(friendName => {
    return `<li class='historical-list-listItem'>${friendName}</li>`
  }).join('');
}

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
    <p class="sidebar-header-userInfo" id="stepGoalCard">
      Your daily step goal is ${user.dailyStepGoal}
    </p>
    <p class="sidebar-header-userInfo" id="avStepGoalCard">
      The average daily step goal is ${userStorage.calculateAverageStepGoal()}
    <p>
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

  sidebar.innerHTML = leftSidebarHtmlBlock;
  headerText.innerText = `${user.getFirstName()}'s Activity Tracker`;
};

function makeHydrationHTML(id, hydrationInfo, userStorage, method) {
  return method.map(drinkData => `<li class="historical-list-listItem">On ${drinkData}oz</li>`).join('');
}

function addHydrationInfo(id, hydrationInfo, dateString, userStorage, laterDateString) {
  const hydrationColumn = document.querySelector('.main-column-hydration');
  const hydrationHtml = ` 
    <section class="infoContainer-cardContainer-card-horizontal">
      <div class="card-today-hydration">
        <p id="hydrationToday">
          <p>You drank</p>
          <p>
            <span class="number">
              ${hydrationInfo.calculateDailyOunces(id, dateString)}
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
      </div>
    </section>
    <section class="infoContainer-cardContainer-card-vertical">
      <div class="card-history-hydration">
        <p class="thisWeek">Water intake this week:</p>
        <div class="sidebar-header-line"></div>
        <ul class="card-vertical-list" id="hydrationThisWeek">
          ${makeHydrationHTML(
            id, 
            hydrationInfo, 
            userStorage, 
            hydrationInfo.calculateFirstWeekOunces(userStorage, id)
          )}
        </ul>
      </div>
      <div class="card-history-hydration">
        <p class="historicalWeek">Water intake earlier weeks:</p>
        <div class="sidebar-header-line"></div>
        <ul class="card-vertical-list" id="hydrationEarlierWeek">
          ${makeHydrationHTML(
            id, 
            hydrationInfo, 
            userStorage, 
            hydrationInfo.calculateRandomWeekOunces(laterDateString, id, userStorage))
          }
        </ul>
      </div>
    </section>
  `
  hydrationColumn.innerHTML = hydrationHtml;
}

function makeSleepHTML(id, sleepInfo, userStorage, method) {
  return method.map(sleepData => {
    return `<li class="historical-list-listItem">On ${sleepData} hours</li>`
  }).join('');
}

function makeSleepQualityHTML(id, sleepInfo, userStorage, method) {
  return method.map(sleepQualityData => {
    return `<li class="historical-list-listItem">On ${sleepQualityData}/5 quality of sleep</li>`
  }).join('');
}

function addSleepInfo(id, sleepInfo, dateString, userStorage, laterDateString) {
  const sleepColumn = document.querySelector('.main-column-sleep');
  const sleepColumnHtml = `
  <section class="infoContainer-cardContainer-card-horizontal">
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
    <div class="card-today-sleep">
      <p id="avUserSleepQuality">
        <p>The average user's sleep quality is</p> 
        <p>
          <span class="number">
            ${Math.round(sleepInfo.calculateAllUserSleepQuality() * 100) / 100}
          </span>
        </p>
        <p>out of 5.</p>
      </p>
    </div>
  </section>
  <section class="infoContainer-cardContainer-card-vertical">
    <div class="card-history-sleep">
      <p class="thisWeek">Hours of sleep this week</p>
      <div class="sidebar-header-line"></div>
      <ul class="card-vertical-list" id="sleepThisWeek">
        ${makeSleepHTML(
          id, 
          sleepInfo, 
          userStorage, 
          sleepInfo.calculateWeekSleep(dateString, id, userStorage)
        )}
      </ul>
    </div>
    <div class="card-history-sleep">
      <p class="historicalWeek">Sleep in Earlier Weeks</p>
      <div class="sidebar-header-line"></div>
      <ul class="card-vertical-list" id="sleepEarlierWeek">
        ${makeSleepHTML(
          id, 
          sleepInfo, 
          userStorage, 
          sleepInfo.calculateWeekSleep(laterDateString, id, userStorage)
        )}
      </ul>
    </div>
  </section>`
  sleepColumn.innerHTML = sleepColumnHtml;
}

function makeStepsHTML(id, activityInfo, userStorage, method) {
  return method.map(activityData => {
    return `<li class="historical-list-listItem">On ${activityData} steps</li>`
  }).join('');
}

function makeStairsHTML(id, activityInfo, userStorage, method) {
  return method.map(data => {
    return `<li class="historical-list-listItem">On ${data} flights</li>`
  }).join('');
}

function makeMinutesHTML(id, activityInfo, userStorage, method) {
  return method.map(data => {
    return `<li class="historical-list-listItem">On ${data} minutes</li>`
  }).join('');
}
// this pattern is being repeated over and over again.
function addActivityInfo(id, activityInfo, dateString, userStorage, laterDateString, user, winnerId) {
  const activityColumn = document.querySelector('.main-column-activity');
  const activityColumnHtml = `
    <section class="infoContainer-cardContainer-card-horizontal">
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
        <div class="card-today-activity">
          <p id="avgStepsToday">
            <p>Average User Step Count Today:</p>
            <p>
              <span class="number">
                ${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'numSteps')}
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
        <div class="card-today-activity">
          <p id="avgStairsToday">
            <p>Average User Stair Count Today:</p>
            <p>
              <span class="number">
                ${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'flightsOfStairs')}
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
        <div class="card-today-activity">
          <p id="avgMinutesToday">
            <p>Average User's Minutes Active Today:</p>
            <p>
              <span class="number">
                ${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'minutesActive')}
              </span>
            </p>
          </p>
        </div>
      </section>
    </section>
    <section class="infoContainer-cardContainer-card-horizontal">
      <section class="horizontalCard-activity-container">
        <div class="card-history-activity">
          <p class="thisWeek">Your steps this week</p>
          <div class="sidebar-header-line"></div>
          <ul class="card-vertical-list" id="userStepsThisWeek">
           ${makeStepsHTML(
             id, 
             activityInfo, 
             userStorage, 
             activityInfo.userDataForWeek(id, dateString, userStorage, "numSteps")
            )}
          </ul>
        </div>
        <div class="card-history-activity">
          <p class="thisWeek">Your stair count this week</p>
          <div class="sidebar-header-line"></div>
          <ul class="card-vertical-list" id="userStairsThisWeek">
            ${makeStairsHTML(
              id, 
              activityInfo, 
              userStorage, 
              activityInfo.userDataForWeek(id, dateString, userStorage, "flightsOfStairs")
            )}
          </ul>
        </div>
      </section>
      <section class="horizontalCard-activity-container">
        <div class="card-history-activity">
          <p class="thisWeek">Your minutes of activity this week</p>
          <div class="sidebar-header-line"></div>
          <ul class="card-vertical-list" id="userMinutesThisWeek">
            ${makeMinutesHTML(id, 
              activityInfo, 
              userStorage, 
              activityInfo.userDataForWeek(id, dateString, userStorage, "minutesActive")
            )}
          </ul>
        </div>
        <div class="card-history-activity">
          <p class="thisWeek">Winner's steps this week</p>
          <div class="sidebar-header-line"></div>
          <ul class="card-vertical-list" id="bestUserSteps">
            ${makeStepsHTML(
              user, 
              activityInfo, 
              userStorage, 
              activityInfo.userDataForWeek(winnerId, dateString, userStorage, "numSteps"))}
          </ul>
        </div>
      </section>
    </section>`;
  activityColumn.innerHTML = activityColumnHtml;
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




export {addInfoToUserSidebar, addHydrationInfo, addSleepInfo, addActivityInfo, addFriendSidebar}
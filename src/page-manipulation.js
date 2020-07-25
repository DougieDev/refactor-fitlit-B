function populateWeeklyDates(repo, id) {
  let mondays = repo.findWeeklyStartDates(id)
  let selectBar = document.querySelector('select')
  mondays.forEach(monday => {
    let week = `Week of ${moment(monday).format('MMMM Do YYYY')}`
    selectBar.insertAdjacentHTML('beforeend', week)
  })
}

function insertForm(event) {
  const dateInput = `date: <input id="date" />`;
  event.target.parentElement.insertAdjacentHTML('afterbegin', dateInput);
  const innerElements = event.target.parentElement.children;
  for (var i = 0; i < innerElements.length; i++) {
    if(innerElements[i].classList.contains('number')
    && !innerElements[i].id.includes('average')) {
      let id = innerElements[i].id;
      innerElements[i].innerHTML = `<input id=${id} />`
    }
  }
  event.target.id = `submit`;
  event.target.innerText = `submit`;
}

function populateDailyData(card, repo, userId, date) {
  const location = document.getElementById(card);
  const innerElements = location.children;
  for(var i = 0; i < innerElements.length; i++) {
    let key = innerElements[i].id.split('-')[0]
    if (innerElements[i].classList.contains('number') && innerElements[i].id.includes('average')) {
      innerElements[i].innerText = repo.calculateAverage(key, userId);
    } else if (innerElements[i].classList.contains('number')) {
      innerElements[i].innerText = repo.findById(userId, date)[key];
    }
  }
}

function insertWeeklyDataLayouts(event) {
  const weekdays = document.querySelectorAll('.historic-data');
  const hydrationWeekdayHtml = `<span class="number">0</span> oz drank`;
  const activityWeekdayHtml =  `Step Count: <span class="number">0</span>
    Stair Count: <span class="number">0</span>
    Minutes Active: <span class="number">0</span>`
  const sleepWeekdayHtml = `Hours Asleep: <span class="number">0</span>
    Sleep Quality: <span class="number">0</span>out of 5`
  const insertLayout = (html) => {
    for (var i = 0; i < weekdays.length; i++) {
      weekdays[i].innerHTML = html;
    }
  };
  if (event.target.id.includes('hydration')) {
    insertLayout(hydrationWeekdayHtml);
  } else if (event.target.id.includes('activity')) {
    insertLayout(activityWeekdayHtml);
  } else if (event.target.id.includes('sleep')) {
    insertLayout(sleepWeekdayHtml);
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


function addInfoToUserSidebar(user, userStorage) {
  const sidebar = document.getElementById('user-sidebar');
  const headerText = document.getElementById('headerText');
  const accountInfo = document.getElementById('account-info');
  const userGoals = document.getElementById('user-goals');
  const accountInfoHtml = `
    <p class="sidebar-friendslist-header" id="userAddress">${user.address}</p>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-friendslist-header" id="userEmail">${user.email}</p>`

  const userGoalsHtml = `
    <p class="sidebar-friendslist-header" id="userStridelength">
      Your stride length is ${user.strideLength} meters.
    </p>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-friendslist-header" id="stepGoalCard">
      Your daily step goal is ${user.dailyStepGoal}
    </p>
    <p class="sidebar-friendslist-header" id="avStepGoalCard">
      The average daily step goal is ${userStorage.calculateAverageStepGoal()}
    <p>`

  const leftSidebarHtmlBlock = `
    <div class="sidebar-header-line"></div>
    <section class="sidebar-body-friendContainer">
      <p class="sidebar-friendslist-header">Friends</p>
      <section class="sidebar-friendContainer-listItems">
        <ul class="card-vertical-list" id="friendList">
          ${makeFriendHTML(user, userStorage)}
        </ul>
      </section>
      <div class="sidebar-header-line"></div>
      <p class="this-week">
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
    <p class="sidebar-friendslist-header" id="bigWinner">
      THIS WEEK'S WINNER! ${activityInfo.showcaseWinner(user, dateString, userStorage)} steps
    </p>
    <div class="sidebar-header-line"></div>
    <p class="sidebar-friendslist-header" id="stepGoalCard"></p>
    <p class="sidebar-friendslist-header" id="avStepGoalCard">
    <p>
    <section class="sidebar-body-friendContainer">
      <section class="sidebar-friendContainer-listItems">
        <p class="this-week">Rank this week</p>
        <ul class="card-vertical-list" id="friendChallengeListToday">
          ${makeFriendChallengeHTML(
            id,
            activityInfo,
            userStorage,
            activityInfo.showChallengeListAndWinner(user, dateString, userStorage))}
        </ul>
        <div class="sidebar-header-line"></div>
        <p class="historical-week">- Historical Rank</p>
        <ul class="card-vertical-list" id="friendChallengeListHistory">
          ${makeFriendChallengeHTML(
            id,
            activityInfo,
            userStorage,
            activityInfo.showChallengeListAndWinner(user, dateString, userStorage))}
        </ul>
        <div class="sidebar-header-line"></div>
      </section>
      <p class="this-week">You had 3 DAY STEP STREAKS on these days:</p>
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




export {
  populateDailyData, 
  insertWeeklyDataLayouts, 
  populateWeeklyDates, 
  addInfoToUserSidebar, 
  addFriendSidebar, 
  insertForm}

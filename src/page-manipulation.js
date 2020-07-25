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


function displayCommunitySection(id, users, repo, activityType, date) {
  const totalMiles = repo.getUserTotalMiles(id, users);
  const userMilesToday = repo.getMilesFromStepsByDate(id, date, user);
  const stepGoalStatus = repo.accomplishedStepGoal(id, date, users);
  const stepsToGo = repo.remainingSteps(id, date, users);
  const stepGoalDates = repo.getDaysGoalExceeded(id, users);
  const streak = repo.getStreak(id, activityType);
 

  // const userMiles = document.getElementById("miles-card");
  // const streaks = document.getElementById("streaks");
  // const userStepsLeft = document.getElementById("steps");
  // const friend = document.getElementById("friend");

  const milesHtml = `
    miles today:
    <span class = "number" id = "miles" >${userMilesToday}</span>
    walked today. < br />
    your total miles walked
    < span class="number" id = "miles-total" >${totalMiles}</span >
    great work! < br />`;

  const stepsHtml = `
    steps to go:
    <span class="number" id="steps-left">${stepsToGo}</span>
    walked today. <br />
    your total miles walked
    <span class="number" id="step-goal">${stepGoalStatus}</span>
    great work! <br />
    steps to go:
    <span class="number" id="best-steps">${streak}</span>`

  const friendsHtml = `
    miles today:
    <span class="number" id="miles">0</span>
    walked today. <br />
    your total miles walked
    <span class="number" id="miles-total">0</span>
    great work! <br />
    steps to go:
    <span class="number" id="steps-left">0</span>
    `;

  const streakHtml = `
    maybe contest info:
    <span class="number" id="winner">0</span>
    crushing it. <br />
    compared stats maybe of winner:
    <span class="number" id="winner-showcase">0</span>
    great work! <br />
    steps to go:
    <span class="number" id="winner-compare">0</span>
    `;

  const displayCards = [
    { html: milesCardHtml, selector: "miles-card" },
    { html: stepGoalHtml, selector: "steps" },
    { html: friendHtml, selector: "friend" },
    { html: streakHtml, selector: "streaks" }
  ];

  const displayCommunity = displayCards => {
    displayCards.forEach(card => {
      let selector = document.getElementById(card.selector)
      selector.innerHTML = card.html;
    })
  }
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




export {populateDailyData, insertWeeklyDataLayouts, addInfoToUserSidebar, addFriendSidebar, insertForm}

import moment from 'moment'

class DOMmanipulator {
  
  populateWeeklyDates(repo, id) {
    const mondays = repo.findWeeklyStartDates(id);
    const select = document.querySelector("#week-select");
    let options = mondays.reduce((week, monday) => {
      const momentMonday = moment(monday).format('MMMM Do YYYY')
      week += `
      <option value="${monday}">
        Week of ${momentMonday}
      </option>`;
      return week;
    }, "");
    select.insertAdjacentHTML("beforeend", options);
  }
  
  changeSystemMessage(message) {
    let display = document.getElementById('app-message')
    display.innerText = message
  }

  
  insertForm(event) {
    const dateInput = `date: <input id="date" />`;
    event.target.parentElement.insertAdjacentHTML('afterbegin', dateInput);
    const innerElements = event.target.parentElement.children;
    for (var i = 0; i < innerElements.length; i++) {
      if (innerElements[i].classList.contains('number')
      && !innerElements[i].id.includes('average')) {
        let id = innerElements[i].id;
        innerElements[i].innerHTML = `<input id=${id} />`
      }
    }
    event.target.id = `submit`;
    event.target.innerText = `submit`;
  }
  populateDailyData(card, repo, userId, date) {
    let location = document.getElementById(card);
    const innerElements = location.children;
    for (var i = 0; i < innerElements.length; i++) {
      let key = innerElements[i].id.split('-')[0]
      if (innerElements[i].classList.contains('number') 
      && innerElements[i].id.includes('average')) {
        innerElements[i].innerText = repo.calculateAverage(key, userId);
      } else if (innerElements[i].classList.contains('number')) {
        innerElements[i].innerText = repo.findById(userId, date)[key];
      }
    }
  }
  
  insertWeekLayout(html) {
    const weekdays = document.querySelectorAll('.historic-data');
    for (var i = 0; i < weekdays.length; i++) {
      weekdays[i].innerHTML = html;
    }
  }
  
  createWeeklyLayoutHtml() {
    return {
      'weekly-hydration': `
        <span class="number" id="numOunces">0</span> oz drank`,
      'weekly-activity': 
        `Step Count: <span class="number" id="numSteps">0</span>
        Stair Count: <span class="number" id="flightsOfStairs">0</span>
        Minutes Active: <span class="number" id="minutesActive">0</span>`,
      'weekly-sleep': 
        `Hours Asleep: <span class="number" id="hoursSlept">0</span>
        Sleep Quality: <span class="number" id="sleepQuality">0</span>out of 5`
    }
  }
  
  populateWeeklyData(repo, userId) {
    const calendar = document.querySelectorAll('.historic-data')
    let date = document.querySelector('select').value
    let week = repo.presentWeek(date, userId)
    for (var i = 0; i < 8; i++) {
      this.populateDailyData(calendar[i].id, repo, userId, week[i]);
    }
  }
  
  displayWeeklyData(event, repo, id) {
    let weeklyHtml = this.createWeeklyLayoutHtml()
    this.insertWeekLayout(weeklyHtml[event.target.id])
    this.populateWeeklyData(repo, id)
  }
  
  populateUserInfo(user, userRepo) {
    this.populateUserSidebar(user, userRepo);
    this.populateUserCard(user, userRepo);
    this.populateInfoCard(user);
  } 
  
  populateUserSidebar(user, repo) {
    const sidebarElements = document.getElementById('user-sidebar').children;
    for (var i = 0; i < sidebarElements.length; i++) {
      if (sidebarElements[i].id === 'header-text') {
        sidebarElements[i].insertAdjacentHTML(
          'afterbegin', `${user.getFirstName()}'s `
        )
      } else if (sidebarElements[i].id === 'friends-list') {
        let friendsHtml;
        friendsHtml = user.friends.reduce((listItems, id) => {
          let friend = repo.findUserById(id);
          return listItems +=
            `<li class="friend" id="${friend.id}">${friend.name}</li>`
        }, '');
        sidebarElements[i].innerHTML = friendsHtml;
      }
    }
  }
  
  
  populateUserCard(user, repo) {
    const trainingStats = document.getElementById('training-stats').children;
    for (var i = 0; i < trainingStats.length; i++) {
      let key = trainingStats[i].id.split('-')[0];
      if (trainingStats[i].classList.contains('number') 
      && trainingStats[i].id.includes('average')) {
        trainingStats[i].innerText = repo.calculateAverage(key);
      } else if (trainingStats[i].classList.contains('number')) {
        trainingStats[i].innerText = user[key]
      }
    } 
  }
  
  populateInfoCard(user) {
    const accountInfo = document.getElementById('account-info').children;
    for (var i = 0; i < accountInfo.length; i++) {
      if (accountInfo[i].classList.contains("number")) {
        accountInfo[i].innerText = user[accountInfo[i].id];
      }
    }
  }

  hideElements() {
    const args = Array.from(arguments)
    args.forEach(element => {
      document.querySelector(element).classList.add('hidden')
    })
  }

  unHideElements() {
    const args = Array.from(arguments)
    args.forEach(element => {
      document.querySelector(element).classList.remove('hidden')
    })
  }

  goToUserPage() {
    this.unHideElements('#user-cards')
    this.hideElements('#daily-cards', '#community-cards')
    this.changeSystemMessage('Looking in the mirror never felt so good')
  }

  goToDailyPage(hydrationRepo, sleepRepo, activityRepo, currentUserId, today) {
    this.unHideElements('#daily-cards')
    this.hideElements('#user-cards', '#community-cards')
    this.populateDailyData('hydration-today', hydrationRepo, currentUserId, today)
    this.populateDailyData('sleep-today', sleepRepo, currentUserId, today)
    this.populateDailyData('activity-today', activityRepo, currentUserId, today)
    this.changeSystemMessage('Here are your stats for today')
  }

  goToContestPage(currentUserId, userRepo, activityRepo, today) {
    this.unHideElements('#community-cards')
    this.hideElements('#daily-cards', '#user-cards')
    this.displayCommunitySection(currentUserId, userRepo, activityRepo, today)
    this.changeSystemMessage('For support or competition, here`s how the community`s doing')
  }

  seeFriendsStats(event) {
    let userId = parseInt(event.target.id);
    this.unHideElements('#daily-cards')
    this.hideElements('#user-cards', '#community-cards')
    this.populateDailyData('hydration-today', hydrationRepo, userId, today)
    this.populateDailyData('sleep-today', sleepRepo, userId, today)
    this.populateDailyData('activity-today', activityRepo, userId, today)
    this.changeSystemMessage(`Here are today's stats from ${event.target.innerText}`)
  }


  displayCommunitySection(id, users, repo, date) {
    const totalMiles = repo.getUserTotalMiles(id, users);
    const userMilesToday = repo.getMilesFromStepsByDate(id, date, users);
    const stepGoalStatus = repo.accomplishedStepGoal(id, date, users);
    const stepsToGo = repo.remainingSteps(id, date, users);
    const stepGoalDates = repo.getDaysGoalExceeded(id, users);
    const numStepsStreak = repo.getStreak(id, 'numSteps');
    const minutesActiveStreak = repo.getStreak(id, 'minutesActive');
    const flightsStreak = repo.getStreak(id, 'flightsOfStairs');
    const stairRecord = repo.getStairRecord(id);


    // const userMiles = document.getElementById("miles-card");
    // const streaks = document.getElementById("streaks");
    // const userStepsLeft = document.getElementById("steps");
    // const friend = document.getElementById("friend");

    const milesHtml = `
    <span class="number" id= "miles" >${userMilesToday}</span>
    walked today. <br />
    your total miles walked:
    <span class="number" id= "miles-total">${totalMiles}</span>
    great work! <br />`;

    const stepsHtml = `
    <span class="message " id="steps-left">${stepsToGo}</span>
    <br />
    <span class="message" id="step-goal">${!stepGoalStatus}</span>
    <br />
    <span class="number" id="best-steps"></span>`

    const friendsHtml = `
    miles today:
    <span class="number" id="miles">0</span>
    walked today. <br />
    <span class="number" id="miles-total">0</span>
    great work! <br />
    steps to go:
    <span class="number" id="steps-left">0</span>
    `;

    const streaksHtml = `
    Minutes Active Streaks:
    <span class="number" id="streak">${minutesActiveStreak.length}</span>
    Step Count Streaks:<br />
    <span class="number" id="winner-showcase">${numStepsStreak.length}</span>
    great work! <br />
    <span class="number" id="winner-showcase">${flightsStreak.length}</span>
    great work! <br />
    Stair record:
    <span class="number" id="winner-compare">${stairRecord}</span>
    `;

    const displayCards = [
      { html: milesHtml, selector: "miles-card"},
      { html: stepsHtml, selector: "steps"},
      { html: friendsHtml, selector: "friend"},
      { html: streaksHtml, selector: "streaks"}
    ];

    displayCards.forEach(card => {
      let selector = document.getElementById(card.selector)
      selector.innerHTML = card.html;
    })
  }
}



export default DOMmanipulator





// populateCommunityData(card, repo, userId, date, users, activityType) {
//   let location = document.getElementById(card);
//   const innerElements = location.children;
//   for (var i = 0; i < innerElements.length; i++) {
//     let key = innerElements[i].id.split('-')[0]
//     if (innerElements[i].classList.contains('number')
//       && innerElements[i].id.includes('average')) {
//       innerElements[i].innerText = repo.calculateAverage(key, userId);
//     } else if (innerElements[i].classList.contains('number')) {
//       innerElements[i].innerText = repo.findById(userId, date)[key];
//     }
//   }
// }


import moment from 'moment';

import {
  userRepo,
  hydrationRepo,
  activityRepo,
  sleepRepo,
  currentUserId
} from './globals';

class PageController {

  constructor() {
    this.dateField = document.getElementById('new-date');
    this.calendar = document.querySelector('#calendar-container')
    this.comingSoon = document.querySelector('#friends-calendar')
  }
  
  changeSystemMessage(message = '') {
    let display = document.getElementById('app-message')
    display.innerText = message
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
    const date = document.getElementById('week-select').value
    const week = repo.presentWeek(date, userId)
    for (var i = 0; i < 8; i++) {
      this.populateDailyData(calendar[i].id, repo, userId, week[i]);
    }
  }
  
  displayWeeklyData(event, id) {
    const repo = this.determineRepo(event)
    let weeklyHtml = this.createWeeklyLayoutHtml()
    this.insertWeekLayout(weeklyHtml[event.target.id])
    this.populateWeeklyData(repo, id)
  }
  
  determineRepo(event) {
    if (event.target.id.includes("hydration")) {
      return hydrationRepo;
    } else if (event.target.id.includes("sleep")) {
      return sleepRepo;
    } else if (event.target.id.includes("activity")) {
      return activityRepo;
    }
  }

  populateUserInfo(user) {
    this.populateUserSidebar(user);
    this.populateUserCard(user);
    this.populateInfoCard(user);
  } 
  
  populateUserSidebar(user) {
    const sidebarElements = document.getElementById('user-sidebar').children;
    for (var i = 0; i < sidebarElements.length; i++) {
      if (sidebarElements[i].id === 'header-text') {
        sidebarElements[i].insertAdjacentHTML(
          'afterbegin', `${user.getFirstName()}'s `
        )
      } else if (sidebarElements[i].id === 'friends-list') {
        let friendsHtml;
        friendsHtml = user.friends.reduce((listItems, id) => {
          let friend = userRepo.findUserById(id);
          return listItems += 
          `<p class="friend" id="${friend.id}">${friend.name}</p>`
        }, '');
        sidebarElements[i].innerHTML = friendsHtml;
      }
    }
  }
  
  populateUserCard(user) {
    const trainingStats = document.getElementById('training-stats').children;
    for (var i = 0; i < trainingStats.length; i++) {
      let key = trainingStats[i].id.split('-')[0];
      if (trainingStats[i].classList.contains('number') 
      && trainingStats[i].id.includes('average')) {
        trainingStats[i].innerText = userRepo.calculateAverage(key);
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

  goToUserPage(user) {
    this.comingSoon.classList.add('hidden')
    this.clearInputForms();
    this.unHideElements('#user-cards')
    this.hideElements('#daily-cards', '#community-cards', '#new-info')
    this.populateUserCard(user);
    this.populateInfoCard(user);
    this.changeSystemMessage('Looking in the mirror never felt so good')
  }

  goToDailyPage(today) {
    this.comingSoon.classList.add('hidden')
    this.calendar.classList.remove('hidden')
    this.unHideElements('#daily-cards', '#new-info')
    this.hideElements('#user-cards', '#community-cards')
    this.populateDailyData(
      'hydration-today', 
      hydrationRepo, 
      currentUserId, 
      today
    )
    this.populateDailyData('sleep-today', sleepRepo, currentUserId, today)
    this.populateDailyData('activity-today', activityRepo, currentUserId, today)
    this.changeSystemMessage('Here are your stats for today')
    this.clearInputForms();
  }

  goToContestPage(today) {
    this.comingSoon.classList.add('hidden')
    this.unHideElements('#community-cards')
    this.clearInputForms();
    this.hideElements('#daily-cards', '#user-cards', '#new-info')
    this.displayCommunitySection(today)
    this.changeSystemMessage('Here`s how the community`s doing')
  }

  seeFriendsStats(event, today) {
    this.calendar.classList.add('hidden')
    this.comingSoon.classList.remove('hidden')
    let userId = parseInt(event.target.id);
    this.unHideElements('#daily-cards')
    this.clearInputForms();
    this.hideElements('#user-cards', '#community-cards', '#new-info')
    this.populateDailyData('hydration-today', hydrationRepo, userId, today)
    this.populateDailyData('sleep-today', sleepRepo, userId, today)
    this.populateDailyData('activity-today', activityRepo, userId, today)
    this.changeSystemMessage(`Here are ${event.target.innerText} stats today`)
  }

  insertForm(event) {
    this.calendar.classList.add('hidden')
    const inputElements = document.querySelectorAll('.number');
    for (var i = 0; i < inputElements.length; i++) {
      if (inputElements[i].classList.contains('number')
        && !inputElements[i].id.includes('average')) {
        let id = inputElements[i].id;
        inputElements[i].innerHTML = `<input id=${id} />`
      }
    }
    this.dateField.classList.remove('hidden')
    event.target.id = `submit`;
    event.target.innerText = `submit`;
  }

  makePostDataFormat(id, newDate) {
    return {
      hydration: {
        userID: id,
        numOunces: '',
        date: newDate
      },
      sleep: {
        userID: id,
        hoursSlept: '',
        sleepQuality: '',
        date: newDate
      },
      activity: {
        userID: id,
        numSteps: '',
        flightsOfStairs: '',
        minutesActive: '',
        date: newDate
      },
    }
  }

  pullInfoFromPage(id) {
    if (this.checkValueFields() === false) {
      this.changeSystemMessage('Please fill in all of the information')
      return `All required values are not present`
    }
    let newDate = document.getElementById('new-date').value;
    newDate = moment(newDate).format('YYYY/MM/DD')
    if (newDate === 'Invalid date') {
      this.changeSystemMessage('The date you`ve provided is' + 
        ' improperly formatted')
      return `invalid date`
    }
    let data = this.makePostDataFormat(id, newDate);
    let inputs = document.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      let grandparent = inputs[i].parentNode.parentNode
      if (inputs[i].id !== 'new-date-field' 
      && !grandparent.parentNode.classList.contains('hidden')) {
        let key = grandparent.id.split('-')[0]
        let childKey = inputs[i].id
        data[key][childKey] = inputs[i].value
      }
    }
    this.changeSystemMessage('Thanks for sticking with ' + 
      'it being fit\'s pretty lit')
    return data
  }

  clearInputForms() {
    let inputs = document.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = ''
    }
    this.dateField.classList.add('hidden')
    const submit = document.getElementById('submit')
    if (inputs === null) {
      submit.innerText = `add new info`;
      submit.id = `new-fitness-entry`;
    }
  }


  checkValueFields() {
    const inputNodes = document.querySelectorAll('input')
    const visibleNodes = [];
    for (var i = 0; i < inputNodes.length; i++) {
      const grandparent = inputNodes[i].parentNode.parentNode.parentNode;
      if (!grandparent.classList.contains('hidden')) {
        visibleNodes.push(inputNodes[i])
      }
    }
    if (visibleNodes.every(nodes => nodes.value !== '')) {
      return true
    } else {
      return false
    }
  }

  addUserDate(today) {
    const currentDate = document.getElementById('user-date')
    currentDate.insertAdjacentHTML(
      'afterbegin', `Your most recent entry is from <br />
      ${moment(today).format('MMMM Do YYYY')}`
    )
  }

  findEligibleDates(id) {
    let hydrationData = hydrationRepo.sortUserDataByDate(id)
    return hydrationData.map(date => date.date)
  }

  communitySectionMiles(date) {
    const totalMiles = activityRepo.getUserTotalMiles(currentUserId, userRepo);
    const userMilesToday = activityRepo.getMilesFromStepsByDate(currentUserId, date, userRepo);
    console.log(totalMiles, userMilesToday); 
    const display = document.getElementById('miles');
    const milesHtml = `
      <p class="message-miles">Total Miles For Today:</p>
      <span class="number" id= "miles" >${userMilesToday}</span>
      <p class="message-miles">Total All-Time Miles:</p>
      <span class="number" id= "miles-total">${totalMiles}</span>
      <p class="message-miles">WOW!</p>`;
    display.innerHTML = milesHtml;
  }

  communitySectionStreak() {
    const numStepsStreak = activityRepo.getStreak(currentUserId, 'numSteps');
    const minutesActiveStreak = activityRepo.getStreak(currentUserId, 'minutesActive');
    const flightsStreak = activityRepo.getStreak(currentUserId, 'flightsOfStairs');
    const stairRecord = activityRepo.getStairRecord(currentUserId);
    const display = document.getElementById('streaks');
    const streaksHtml = `
      <p class="message-comm">Minutes Active:</p>
      <span class="number" id="streak">${minutesActiveStreak.length}</span>
      <p class="message-comm">Step Goal Total:</p>
      <span class="number" id="">${numStepsStreak.length}</span>
      <p class="message-comm">Stair Goal Total:</p>
      <span class="number" id="">${flightsStreak.length}</span>
      <p class="message-comm"Stair record:</p>
      <span class="number" id="">${stairRecord}</span>
    `;
    display.innerHTML = streaksHtml;
  }

  communitySectionSteps(date) {
    console.log(date);
    const stepGoalStatus = activityRepo.accomplishedStepGoal(currentUserId, date, userRepo);
    const stepsToGo = activityRepo.remainingSteps(currentUserId, date, userRepo);
    const stepGoalDates = activityRepo.getDaysGoalExceeded(currentUserId, userRepo);
    let display = document.getElementById('steps');
    const stepsHtml = `
      <span class="message" id="steps-left">${stepsToGo}</span>
      <p class="message-step" id="step-goal">${stepGoalStatus}</p>
      <p class="message-step">Last time goal hit:</p>
      <a class="message step-list" id="best-steps">${stepGoalDates[0]}</a>
      <p class="message-step>Keep it up!</p>
    `;
    display.innerHTML = stepsHtml;
  }

  communitySectionCompetitive(date) {
    const user = userRepo.findUserById(currentUserId);
    const stepWinner = userRepo.showcaseWinner(user, date);
    const bestSleeper = userRepo.determineSleepWinnerForWeek(date);
    const display = document.getElementById('friends');
    const friendsHtml = `
      <p class="message-comm">Top Performer:</p>
      <span class="message-friend" id="friend-perform">${stepWinner}</span>
      <p class="message-comm">Most Rested:</p>
      <span class="message-friend" id="friend-activity">${bestSleeper}</span>
      <p class="message-comm">Todays Winner:</p>
      <span class="number" id="">TBD</span>
    `;
    display.innerHTML = friendsHtml;
  }

  displayCommunitySection() {
    this.communitySectionMiles();
    this.communitySectionStreak();
    this.communitySectionSteps();
    this.communitySectionCompetitive();
  }
}


export default PageController

import moment from 'moment';
import {
  userRepo,
  hydrationRepo,
  activityRepo,
  sleepRepo,
  currentUserId,
} from './globals';

class DOMmanipulator {
  constructor() {
    this.dateField = document.getElementById('new-date');
  }
  
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
    const date = document.querySelector('select').value
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
    this.unHideElements('#user-cards')
    this.hideElements('#daily-cards', '#community-cards', '#new-info')
    this.populateUserCard(user);
    this.populateInfoCard(user);
    this.clearInputForms();
    this.changeSystemMessage('Looking in the mirror never felt so good')
  }

  goToDailyPage(today) {
    this.unHideElements('#daily-cards', '#new-info')
    this.hideElements('#user-cards', '#community-cards')
    this.populateDailyData(
    'hydration-today', 
    hydrationRepo, 
    currentUserId, 
    today)
    this.populateDailyData('sleep-today', sleepRepo, currentUserId, today)
    this.populateDailyData('activity-today', activityRepo, currentUserId, today)
    this.changeSystemMessage('Here are your stats for today')
    this.clearInputForms();
  }

  goToContestPage(today) {
    this.unHideElements('#community-cards')
    this.clearInputForms();
    this.hideElements('#daily-cards', '#user-cards', '#new-info')
    this.displayCommunitySection(currentUserId, userRepo, activityRepo, today)
    this.changeSystemMessage('Here`s how the community`s doing')
  }

  seeFriendsStats(event, today) {
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
      sleep:{
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
      submit.id = `new-fitness-entry`;
      event.target.innerText = `add new info`;
    }
  }


  checkValueFields() {
    // debugger
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


  displayCommunitySection(id, users, activity, date) {
    const totalMiles = activity.getUserTotalMiles(id, users);
    const userMilesToday = activity.getMilesFromStepsByDate(id, date, users);
    const stepGoalStatus = activity.accomplishedStepGoal(id, date, users);
    const stepsToGo = activity.remainingSteps(id, date, users);
    const stepGoalDates = activity.getDaysGoalExceeded(id, users);
    const numStepsStreak = activity.getStreak(id, 'numSteps');
    const minutesActiveStreak = activity.getStreak(id, 'minutesActive');
    const flightsStreak = activity.getStreak(id, 'flightsOfStairs');
    const stairRecord = activity.getStairRecord(id);

    const milesHtml = `
      <p class="message-miles">-----</p>
      <span class="number" id= "miles" >${userMilesToday}</span>
      <p class="message-miles">-----</p>
      your all time miles walked:
      <span class="number" id= "miles-total">${totalMiles}</span>
      <p class="message-miles">-----</p>`;

    const stepsHtml = `
      <span class="message" id="steps-left">${stepsToGo}</span>
      <p class="message-step" id="step-goal">${stepGoalStatus}</p>
      <p class="message-step">Last three step streaks:</p>
      <a class="message step-list" id="best-steps">${stepGoalDates[0]}</a>
      <a class="message step-list" id="best-steps">${stepGoalDates[1]}</a>
      <a class="message step-list" id="best-steps">${stepGoalDates[2]}</a>
    `;

    const friendsHtml = `
      <p class="message-comm">Todays Winner:</p>
      <span class="number" id="">0</span>
      <p class="message-comm">Todays Winner:</p>
      <span class="number" id="">0</span>
      <p class="message-comm">Todays Winner:</p>
      <span class="number" id="">0</span>
    `;

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

    const displayCards = [
      {html: milesHtml, selector: "miles"},
      {html: stepsHtml, selector: "steps"},
      {html: friendsHtml, selector: "friends"},
      {html: streaksHtml, selector: "streaks"}
    ];

    displayCards.forEach(card => {
      let select = document.getElementById(card.selector)
      select.innerHTML = card.html;
    })
  }
}


export default DOMmanipulator

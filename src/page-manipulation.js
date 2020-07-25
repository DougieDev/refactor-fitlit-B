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
      if(innerElements[i].classList.contains('number')
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
    for(var i = 0; i < innerElements.length; i++) {
      let key = innerElements[i].id.split('-')[0]
      if (innerElements[i].classList.contains('number') && innerElements[i].id.includes('average')) {
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
  };
  
  createWeeklyLayoutHtml() {
    return {
      'weekly-hydration': `
        <span class="number" id="numOunces">
          0
        </span> oz drank`,
      'weekly-activity': `Step Count: <span class="number" id="numSteps">0</span>
        Stair Count: <span class="number" id="flightsOfStairs">0</span>
        Minutes Active: <span class="number" id="minutesActive">0</span>`,
      'weekly-sleep': `Hours Asleep: <span class="number" id="hoursSlept">0</span>
          Sleep Quality: <span class="number" id="sleepQuality">0</span>out of 5`
    }
  }
  
  populateWeeklyData(repo, userId) {
    const calendar = document.querySelectorAll('.historic-data')
    let date = document.querySelector('select').value
    let week = repo.presentWeek(date, userId)
    for(var i = 0; i < 8; i++) {
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
        sidebarElements[i].insertAdjacentHTML('afterbegin', `${user.getFirstName()}'s `)
      } else if (sidebarElements[i].id === 'friends-list') {
        let friendsHtml = user.friends.reduce((listItems, id) => {
          let friend = repo.findUserById(id)
          return listItems += `<li class="friend" id="${friend.id}">${friend.name}</li>`
        }, '')
        sidebarElements[i].innerHTML = friendsHtml;
      }
    }
  }
  
  populateUserCard(user, repo) {
    const trainingStats = document.getElementById('training-stats').children;
    for (var i = 0; i < trainingStats.length; i++) {
      let key = trainingStats[i].id.split('-')[0];
      if (trainingStats[i].classList.contains('number') && trainingStats[i].id.includes('average')) {
        trainingStats[i].innerText = repo.calculateAverage(key);
      } else if (trainingStats[i].classList.contains('number')) {
        trainingStats[i].innerText = user[key]
      }
    } 
  }
  
  populateInfoCard(user) {
    const accountInfo = document.getElementById('account-info').children;
    for(var i = 0; i < accountInfo.length; i++) {
      if(accountInfo[i].classList.contains("number")) {
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
}


export default DOMmanipulator

import './css/style.scss';

import './images/person walking on path.jpg';
import './images/arnie.jpg';

import User from './User';
import ActivityRepo from './ActivityRepo';
import UserRepo from './UserRepo';
import Repo from './Repo'

import {
  populateUserInfo,
  populateDailyData,
  populateWeeklyDates,
  insertForm, 
  displayWeeklyData,
  changeSystemMessage
} from './page-manipulation';

import moment from 'moment'

const userRepo = new UserRepo();
const hydrationRepo = new Repo();
const activityRepo = new ActivityRepo(); 
const sleepRepo = new Repo();

const currentUserId = getRandomNumber()
let currentUser;
let today;

function getRandomNumber() {
  return Math.floor(Math.random() * 50)
}

function startApp() {
  catchAllData('userData', 'hydrationData', 'sleepData', 'activityData')
}

const sideBar = document.querySelector('.sidebar-container')
const selectBar = document.querySelector('#week-select')
const buttons = document.querySelectorAll('button')

sideBar.addEventListener('click', sidebarHandler)
selectBar.addEventListener('click', selectHandler)
for(const button of buttons) {
  button.addEventListener('click', buttonHandler);
}

function sidebarHandler(event) {
  if(event.target.className === 'friend') {
    let userId = parseInt(event.target.id);
    unHideElements('#daily-cards')
    hideElements('#user-cards', '#community-cards')
    populateDailyData('hydration-today', hydrationRepo, userId, today)
    populateDailyData('sleep-today', sleepRepo, userId, today)
    populateDailyData('activity-today', activityRepo, userId, today)
    changeSystemMessage(`Here are today's stats from ${event.target.innerText}`)
  }
  if(event.target.id.includes('stats')) {
    buttonHandler(event)
  }
}

function buttonHandler(event) {
  let repoPass = determineRepo(event)
  let button = event.target;
  if (button.id.includes('new')) {
    insertForm(event);
  } else if (button.id === 'submit') {
    console.log(`run populate data, POST function, and do something with new date information.`)
  } else if (button.id.includes('weekly')) {
    displayWeeklyData(event, repoPass, currentUserId);
  } else if (button.id.includes('user-stats')) {
    unHideElements('#user-cards')
    hideElements('#daily-cards', '#community-cards')
    changeSystemMessage('Looking in the mirror never felt so good')
  } else if (button.id.includes('daily-stats')) {
    unHideElements('#daily-cards')
    hideElements('#user-cards', '#community-cards')
    populateDailyData('hydration-today', hydrationRepo, currentUserId, today)
    populateDailyData('sleep-today', sleepRepo, currentUserId, today)
    populateDailyData('activity-today', activityRepo, currentUserId, today)
    changeSystemMessage('Here are your stats for today')
  } else if (button.id.includes('contest-stats')) {
    unHideElements('#community-cards')
    hideElements('#daily-cards', '#user-cards')
    changeSystemMessage('For support or competition, here`s how the community`s doing')
  }
}

function determineRepo(event) {
  if (event.target.id.includes("hydration")) {
    return hydrationRepo;
  } else if (event.target.id.includes("sleep")) {
    return sleepRepo;
  } else if (event.target.id.includes("activity")) {
    return activityRepo;
  }
}

function selectHandler(event) {
  unHideElements(
    '#weekly-hydration', 
    '#weekly-activity', 
    '#weekly-sleep'
    )
}

function hideElements() {
  const args = Array.from(arguments)
  args.forEach(element => {
    document.querySelector(element).classList.add('hidden')
  })
}

function unHideElements() {
  const args = Array.from(arguments)
  args.forEach(element => {
    document.querySelector(element).classList.remove('hidden')
  })

}

function catchAllData() {
  const args = Array.from(arguments);
  args.forEach(arg => catchData(arg));
}

function catchData(src) {
  const classInfo = findClassInfo(src);
  return fetch(`https://fe-apps.herokuapp.com/api/v1/fitlit/1908/${classInfo.url}/${src}`)
    .then(response => response.json())
    .then(data => data[src])
    .then(result => classInfo.class.storeData(result, src))
    .then(repo => dataEventHandler(src))
}

function dataEventHandler(src) {
  if (src === 'userData') {
    currentUser = new User(userRepo.findUserById(currentUserId));
    populateUserInfo(currentUser, userRepo);
  } else if (src === 'hydrationData') {
    today = hydrationRepo.getToday(currentUserId)
    populateDailyData('hydration-today', hydrationRepo, currentUserId, today)
    populateWeeklyDates(hydrationRepo, currentUserId)
  } else if (src === 'sleepData') {
    today = sleepRepo.getToday(currentUserId)
    populateDailyData('sleep-today', sleepRepo, currentUserId, today)
  } else if (src === 'activityData') {
    today = activityRepo.getToday(currentUserId)
    populateDailyData('activity-today', activityRepo, currentUserId, today)
  }
}

function findClassInfo(src) {
  const classInfo = {}
  if (src.includes('user')) {
    classInfo.url = 'users';
    classInfo.class = userRepo;
  } else if (src.includes('sleep')) {
    classInfo.url = 'sleep';
    classInfo.class = sleepRepo;
  } else if (src.includes('activity')) {
    classInfo.url = 'activity';
    classInfo.class = activityRepo;
  } else if (src.includes('hydration')) {
    classInfo.url = 'hydration';
    classInfo.class = hydrationRepo;
  }
  return classInfo;
}

startApp();




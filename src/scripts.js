import './css/style.scss';

import './images/person walking on path.jpg';
import './images/arnie.jpg';

import User from './User';
import DOMmanipulator from './page-manipulation';
import {
  userRepo, 
  hydrationRepo, 
  activityRepo, 
  sleepRepo, 
  currentUserId, 
} from './globals';



const page = new DOMmanipulator();
let currentUser;
let today;
// const userRepo = new UserRepo();
// const hydrationRepo = new Repo();
// const activityRepo = new ActivityRepo(); 
// const sleepRepo = new Repo();

// const currentUserId = getRandomNumber()
// let currentUser;
// let today;

const sideBar = document.querySelector('.sidebar-container')
const selectBar = document.querySelector('#week-select')
const buttons = document.querySelectorAll('button')

for (const button of buttons) {
  button.addEventListener('click', buttonHandler);
}
sideBar.addEventListener('click', sidebarHandler)
selectBar.addEventListener('click', selectBarHandler)

function buttonHandler(event) {
  let repoPass = determineRepo(event)
  let button = event.target;
  if (button.id.includes('new')) {
    page.insertForm(event);
  } else if (button.id === 'submit') {
    //POST FUNCTIONALITY
  } else if (button.id.includes('weekly')) {
    page.displayWeeklyData(event, repoPass, currentUserId);
  } else if (button.id.includes('user-stats')) {
    page.goToUserPage();
  } else if (button.id.includes('daily-stats')) {
    page.goToDailyPage(today);
  } else if (button.id.includes('contest-stats')) {
    page.goToContestPage();
  }
}

function sidebarHandler(event) {
  if (event.target.className === 'friend') {
    page.seeFriendsStats(event, today)
  }
  if (event.target.id.includes('stats')) {
    buttonHandler(event)
  }
}

function selectBarHandler() {
  page.unHideElements('#weekly-hydration', '#weekly-activity', '#weekly-sleep')
}
  
const dataEventHandler = (dataSet) => {
  if (dataSet === 'userData') {
    currentUser = new User(userRepo.findUserById(currentUserId));
    page.populateUserInfo(currentUser);
  } else if (dataSet === 'hydrationData') {
    today = hydrationRepo.getToday(currentUserId)
    page.populateDailyData(
      'hydration-today', 
      hydrationRepo, 
      currentUserId, 
      today
    )
    page.populateWeeklyDates(hydrationRepo, currentUserId)
  } else if (dataSet === 'sleepData') {
    today = sleepRepo.getToday(currentUserId)
    page.populateDailyData('sleep-today', sleepRepo, currentUserId, today)
  } else if (dataSet === 'activityData') {
    today = activityRepo.getToday(currentUserId)
    page.populateDailyData('activity-today', activityRepo, currentUserId, today)
  }
}

const startApp = () => {
  catchAllData('userData', 'hydrationData', 'sleepData', 'activityData')
}

function catchAllData() {
  const args = Array.from(arguments);
  args.forEach(arg => catchData(arg));
}

const catchData = (dataSet) => {
  const classInfo = findClassInfo(dataSet);
  const apiHead = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908';
  return fetch(`${apiHead}/${classInfo.url}/${dataSet}`)
    .then(response => response.json())
    .then(data => data[dataSet])
    .then(result => classInfo.class.storeData(result, dataSet))
    .then(() => dataEventHandler(dataSet));
}

const findClassInfo = (dataSet) => {
  const classInfo = {}
  if (dataSet.includes('user')) {
    classInfo.url = 'users';
    classInfo.class = userRepo;
  } else if (dataSet.includes('sleep')) {
    classInfo.url = 'sleep';
    classInfo.class = sleepRepo;
  } else if (dataSet.includes('activity')) {
    classInfo.url = 'activity';
    classInfo.class = activityRepo;
  } else if (dataSet.includes('hydration')) {
    classInfo.url = 'hydration';
    classInfo.class = hydrationRepo;
  }
  return classInfo;
}

const determineRepo = (event) => {
  if (event.target.id.includes("hydration")) {
    return hydrationRepo;
  } else if (event.target.id.includes("sleep")) {
    return sleepRepo;
  } else if (event.target.id.includes("activity")) {
    return activityRepo;
  }
}

startApp();

export {currentUser, today}
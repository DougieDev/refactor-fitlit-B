import './css/style.scss';

import './images/person walking on path.jpg';
import './images/arnie.jpg';

import User from './User';
import DOMmanipulator from './page-manipulation';
import addCalendar from './calendar'

import {
  userRepo, 
  hydrationRepo, 
  activityRepo, 
  sleepRepo, 
  currentUserId, 
} from './globals';

const apiHead = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908';
const page = new DOMmanipulator();
let currentUser;
let today;

const sideBar = document.querySelector('.sidebar-container')
const selectBar = document.querySelector('#week-select')
const buttons = document.querySelectorAll('button')

for (const button of buttons) {
  button.addEventListener('click', buttonHandler);
}
sideBar.addEventListener('click', sidebarHandler)
selectBar.addEventListener('click', selectBarHandler)

function buttonHandler(event) {
  let button = event.target;
  if (button.id.includes('new')) {
    page.insertForm(event);
  } else if (button.id === 'submit') {
    let newInfo = page.pullInfoFromPage(currentUserId);
    let fetchPackage = organizePost(newInfo);
    postAllData(fetchPackage);
    page.clearInputForms()
    page.goToDailyPage()
  } else if (button.id.includes('weekly')) {
    page.displayWeeklyData(event, currentUserId);
  } else if (button.id.includes('user-stats')) {
    page.goToUserPage(currentUser);
  } else if (button.id.includes('daily-stats')) {
    page.goToDailyPage(today);
  } else if (button.id.includes('community-stats')) {
    page.goToContestPage(today);
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
    addCalendar(currentUserId)
    page.addUserDate(today)
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
  catchAllData('userData', 'hydrationData', 'sleepData', 'activityData');
}

function catchAllData() {
  const args = Array.from(arguments);
  args.forEach(arg => catchData(arg));
}

const postAllData = (data) => {
  data.forEach(postObject => postData(postObject))
}

const postData = (data) => {
  fetch(`${apiHead}/${data.path}/${data.destination}`, data.postObject)
    .then(response => response.json())
    .then(() => page.changeSystemMessage('Success!'))
    .catch(err => page.changeSystemMessage(err));
}


const catchData = (dataSet) => {
  const classInfo = findClassInfo(dataSet);
  return fetch(`${apiHead}/${classInfo.url}/${dataSet}`)
    .then(response => response.json())
    .then(data => data[dataSet])
    .then(result => classInfo.class.storeData(result, dataSet))
    .then(() => dataEventHandler(dataSet))
    .catch(() => page.changeSystemMessage('Something went wrong ' +
    'please try again'))
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

const makePostObject = (data) => {
  return {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
}

const organizePost = (info) => {
  const dataSets = Object.keys(info);
  return dataSets.reduce((postPackages, key) => {
    postPackages.push({
      path: key,
      destination: key + 'Data',
      postObject: makePostObject(info[key])
    })
    return postPackages
  }, [])  
}

startApp();

export {currentUser, today, page}
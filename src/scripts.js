import './css/style.scss';

import './images/person walking on path.jpg';
import './images/arnie.jpg';

import Repo from './Repo';

// import User from './User';
// import Activity from './Activity';
// import Hydration from './Hydration';
// import Sleep from './Sleep';
// import UserRepo from './User-repo';

import {
  populateDailyData,
  addInfoToUserSidebar,
  insertForm, 
  insertWeeklyDataLayouts,
  addFriendSidebar
} from './page-manipulation';

const userRepo = new Repo();
const hydrationRepo = new Repo();
const activityRepo = new Repo(); 
const sleepRepo = new Repo();

const repo = new Repo()


function startApp() {
  catchAllData('userData', 'hydrationData', 'sleepData', 'activityData');
}
const buttons = document.querySelectorAll('button');
for(const button of buttons) {
  button.addEventListener('click', buttonHandler);
}

function buttonHandler(event) {
  if (event.target.id.includes('new')) {
    // originalCardContent = event.target.parentElement.innerHTML;
    insertForm(event);
  } else if (event.target.id === 'submit') {
    console.log(`run populate data, POST function, and do something with new date information.`)
  } else if (event.target.id.includes('weekly')) {
    insertWeeklyDataLayouts(event);
  }
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
    .then(result => repo.storeData(result, src))
    .then(repo => dataEventHandler(src));
}

function dataEventHandler(src) {
  if (src === 'userData') {
    // startUserPopulation()
    console.log(repo.users);
  } else if (src === 'hydrationData') {
    // startHydrationPopulation()
    console.log(repo.hydration);
  } else if (src === 'sleepData') {
    // startSleepPopulation() 
    console.log(repo.sleep);
  } else if (src === 'activityData') {
    // startActivityPopulation()
    console.log(repo.activity); 
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




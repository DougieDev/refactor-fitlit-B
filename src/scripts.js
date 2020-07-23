import './css/style.scss';

import './images/person walking on path.jpg';
import './images/arnie.jpg';



import User from './User';
import ActivityRepo from './ActivityRepo';
import HydrationRepo from './HydrationRepo';
import SleepRepo from './SleepRepo';
import UserRepo from './UserRepo';

import {
  populateDailyData,
  addInfoToUserSidebar,
  insertForm, 
  insertWeeklyDataLayouts,
  addFriendSidebar
} from './page-manipulation';

const userRepo = new UserRepo();
const hydrationRepo = new HydrationRepo();
const activityRepo = new ActivityRepo(); 
const sleepRepo = new SleepRepo();

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
    .then(result => classInfo.class.storeData(result, src))
    .then(repo => dataEventHandler(src));
}

function dataEventHandler(src) {
  if (src === 'userData') {
    // startUserPopulation()
    console.log(userRepo);
  } else if (src === 'hydrationData') {
    // startHydrationPopulation()
    console.log(hydrationRepo);
  } else if (src === 'sleepData') {
    // startSleepPopulation() 
    console.log(sleepRepo);
  } else if (src === 'activityData') {
    // startActivityPopulation()
    console.log(activityRepo); 
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




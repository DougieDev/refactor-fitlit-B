import './css/style.scss';

import './images/person walking on path.jpg';
import './images/arnie.jpg';

import Repo from './Repo';
import HydrationRepo from './Hydration-repo'
import ActivityRepo from './Activity-repo'
import SleepRepo from './Sleep-repo'

import {
  populateDailyData,
  addInfoToUserSidebar, 
  addFriendSidebar
} from './page-manipulation';

const userRepo = new Repo();
const hydrationRepo = new Repo();
const activityRepo = new Repo(); 
const sleepRepo = new Repo();

function startApp() {
  catchAllData('userData', 'hydrationData', 'sleepData', 'activityData');
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
    .then(repo => console.log(classInfo.class));
}

function findClassInfo(src) {
  const classInfo = {}
  if (src.includes('user')) {
    classInfo.url = 'users'
    classInfo.class = userRepo;
  } else if (src.includes('sleep')) {
    classInfo.url = 'sleep'
    classInfo.class = sleepRepo;
  } else if (src.includes('activity')) {
    classInfo.url = 'activity'
    classInfo.class = activityRepo;
  } else if (src.includes('hydration')) {
    classInfo.url = 'hydration'
    classInfo.class = hydrationRepo;
  }
  return classInfo;
}

startApp();

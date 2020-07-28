import ActivityRepo from './ActivityRepo';
import UserRepo from './UserRepo';
import Repo from './Repo';
import Time from './Time';

const userRepo = new UserRepo();
const hydrationRepo = new Repo();
const activityRepo = new ActivityRepo();
const sleepRepo = new Repo();
const time = new Time();

const currentUserId = getRandomNumber()

function getRandomNumber() {
  return Math.floor(Math.random() * 50)
}

export {
  userRepo, 
  hydrationRepo, 
  activityRepo, 
  sleepRepo, 
  currentUserId, 
  time
}
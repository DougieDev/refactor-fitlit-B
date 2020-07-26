import ActivityRepo from './ActivityRepo';
import UserRepo from './UserRepo';
import Repo from './Repo';

const userRepo = new UserRepo();
const hydrationRepo = new Repo();
const activityRepo = new ActivityRepo();
const sleepRepo = new Repo();

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

}
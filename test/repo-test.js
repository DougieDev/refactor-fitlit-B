import { expect } from 'chai';

import Repo from '../src/Repo';
import Hydration from "../src/Hydration";
import Sleep from "../src/Sleep";
import Activity from "../src/Activity";
import User from "../src/User";

describe('Repo', () => {
  let user1;
  let user2;
  let rawUsers;
  let hydration1;
  let hydration2;
  let rawHydration;
  let activity1;
  let activity2;
  let rawActivity;
  let sleep1;
  let sleep2;
  let rawSleep;
  let repo;

  beforeEach(function() {
    user1 = {
      id: 3000,
      name: 'Joshua Danger Sevy',
      address: "3000 Champions Lane, Mars",
      email: "google@gmail.com",
      strideLength: 458,
      dailyStepGoal: 1,
      friends: [1]
    }

    user2 = {
      id: 1,
      name: '#D0UG13',
      address: 'Inter-dimensional Palace',
      email: "google@gmail.com",
      strideLength: 4802,
      dailyStepGoal: 4802,
      friends: [3000]
    }
    
    hydration1 = {
      userID: 3000,
      date: '2040/01/01',
      numOunces: 60
    }

    hydration2 = {
      userID: 1,
      date: '400/01/01',
      numOunces: 600
    }

    activity1 = {
      userID: 3000,
      date: '2040/01/01',
      numSteps: 3848,
      minutesActive: 8000,
      flightsOfStairs: 100,
    }
    
    activity2 = {
      userID: 1,
      date: '400/01/01',
      numSteps: 38045,
      minutesActive: 1,
      flightsOfStairs: 0,
    }
    
    sleep1 = {
      userID: 3000,
      date: '2040/01/01',
      hoursSlept: 0,
      sleepQuality: 5
    }
    
    sleep2 = {
      userID: 3000,
      date: '400/01/01',
      hoursSlept: 6,
      sleepQuality: 5
    }

    rawUsers = [user1, user2];
    rawHydration = [hydration1, hydration2];
    rawActivity = [activity1, activity2]
    rawSleep = [sleep1, sleep2]

    repo = new Repo();
  });

  it('should be an instance of Repo', () => {
    expect(repo).to.be.an.instanceOf(Repo)
  });  

  it.only('should save hydration, activity, sleep and user datasets ' + 
  'to corresponding keys', () => {
    repo.storeData(rawUsers, 'userData')
    repo.storeData(rawHydration, 'hydrationData')
    repo.storeData(rawActivity, 'activityData')
    repo.storeData(rawSleep, 'sleepData')
    expect(repo.users[0].name).to.equal('Joshua Danger Sevy')
    expect(repo.hydration[0].numOunces).to.equal(60)
    expect(repo.sleep[0].hoursSlept).to.equal(0)
    expect(repo.activity[0].minutesActive).to.equal(8000)
  });

  it.only('should refuse to save incorrect data types into wrongly called keys', () => {
    let response = repo.storeData(rawHydration, 'userData');
    repo.storeData(rawSleep, 'activityData');
    expect(repo.users).to.equal(undefined);
    expect(repo.activity).to.equal(undefined);
    expect(response).to.equal('You have provided either incomplete or incorrect data')
  });
});

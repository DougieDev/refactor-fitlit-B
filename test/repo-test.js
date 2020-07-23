import { expect } from 'chai';

import Repo from '../src/Repo';

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
  let sleep3;
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
      userID: 1,
      date: '400/01/01',
      hoursSlept: 6,
      sleepQuality: 5
    }
    
    sleep3 = {
      userID: 3000,
      date: '2040/01/02',
      hoursSlept: 24,
      sleepQuality: 5
    }

    rawUsers = [user1, user2];
    rawHydration = [hydration1, hydration2];
    rawActivity = [activity1, activity2]
    rawSleep = [sleep1, sleep2, sleep3]

    repo = new Repo();
  });

  it('should be an instance of Repo', () => {
    expect(repo).to.be.an.instanceOf(Repo)
  });  

  it('should be able to save data', () => {
    repo.storeData(rawUsers)
    expect(repo.data).to.deep.equal(rawUsers)
  })

  it('should only save data that is an array', () => {
    repo.storeData(0)
    expect(repo.data).to.equal(undefined)
  })

  it('should be able to find a data point by id', () => {
    repo.storeData(rawSleep)
    let sleep = repo.findById(3000, '2040/01/01')
    expect(sleep).to.deep.equal(sleep1)
  })
  // SAD PATH: what happens when userId is not a number?
  
  it('should be able to find a user by id', () => {
    repo.storeData(rawUsers)
    let user = repo.findById(3000)
    expect(user).to.deep.equal(user1)
  })
  // SAD PATH: what happens when userId is not a number?

  it('should be able to filter data for a given user', () => {
    repo.storeData(rawSleep)
    let sleep = repo.findAllUserData(3000)
    expect(sleep).to.deep.equal([sleep1, sleep3])
  })
  // SAD PATH: what happens when userId is not a number?
  it('should be able to the average of a given key for all stored data', () => {
    repo.storeData(rawSleep)
    let averageSleep = repo.calculateAverage('hoursSlept') 
    expect(averageSleep).to.equal(10)
  });
  // SAD PATH: what happens when value is not a number?
});

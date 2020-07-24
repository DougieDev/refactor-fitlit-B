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
  let sleep4;
  let sleep5;
  let sleep6;
  let sleep7;
  let sleep8;
  let sleep0;
  let rawSleep;
  let repo;
  let userRepo;
  let sleepRepo;
  let hydrationRepo;
  let activityRepo;

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
      date: '2040/01/04',
      hoursSlept: 27,
      sleepQuality: 0
    }
    
    sleep2 = {
      userID: 1,
      date: '2040/01/04',
      hoursSlept: 18,
      sleepQuality: 5
    }
    
    sleep3 = {
      userID: 3000,
      date: '2040/01/05',
      hoursSlept: 27,
      sleepQuality: 5
    }

    sleep4 = {
      userID: 3000,
      date: '2040/01/06',
      hoursSlept: 18,
      sleepQuality: 5
    }

    sleep5 = {
      userID: 3000,
      date: '2040/01/07',
      hoursSlept: 27,
      sleepQuality: 5
    }

    sleep6 = {
      userID: 3000,
      date: '2040/01/08',
      hoursSlept: 18,
      sleepQuality: 5
    }

    sleep7 = {
      userID: 3000,
      date: '2040/01/09',
      hoursSlept: 27,
      sleepQuality: 5
    }

    sleep8 = {
      userID: 3000,
      date: '2040/01/10',
      hoursSlept: 18,
      sleepQuality: 5
    }

    sleep0 = {
      userID: 3000,
      date: '2020/01/01',
      hoursSlept: 27,
      sleepQuality: 5
    }
    

    rawUsers = [user1, user2];
    rawHydration = [hydration1, hydration2];
    rawActivity = [activity1, activity2]
    rawSleep = [sleep1, sleep2, sleep3, sleep4, sleep5, sleep6, sleep7, sleep8, sleep0]

    repo = new Repo();
    userRepo = new Repo();
    hydrationRepo = new Repo();
    activityRepo = new Repo();
    sleepRepo = new Repo();
    userRepo.storeData(rawUsers);
    hydrationRepo.storeData(rawHydration);
    activityRepo.storeData(rawActivity);
    sleepRepo.storeData(rawSleep);
  });

  it('should be an instance of Repo', () => {
    expect(repo).to.be.an.instanceOf(Repo)
  });  

  it('should be able to save data', () => {
    repo.storeData(rawUsers)
    expect(repo.users).to.deep.equal(rawUsers)
    console.log(repo)
  })

  it('should only save data that is an array', () => {
    repo.storeData(0)
    expect(repo.data).to.equal(undefined)
  })

  it('should be able to find a data point by id', () => {
    repo.storeData(rawSleep)
    let sleep = repo.findById(3000, '2040/01/04')
    expect(sleep).to.deep.equal(sleep1)
  })

  it('should only search for ids that are numbers', () => {
    repo.storeData(rawSleep)
    let sleep = repo.findById('Josh', '2040/01/01')
    expect(sleep).to.equal('This id is incorrect')
  });
  
  it('should only search for dates that are strings in the correct format', () => {
    repo.storeData(rawSleep);
    let result1 = repo.findById(3000, '240/1/1');
    let result2 = repo.findById(3000, "aaa/bb/r");
    expect(result1).to.equal('This date is improperly formatted')
    expect(result2).to.equal('This date is improperly formatted')
  })

  it('should be able give to the average of a given key for all stored data', () => {
    repo.storeData(rawSleep)
    let averageSleep = repo.calculateAverage('hoursSlept') 
    expect(averageSleep).to.equal(23)
  });

  it('should be able to calculate the average of a given key for a given user', () => {
    let average = sleepRepo.calculateAverage('sleepQuality', 3000);
    expect(average).to.equal(4.375)
  })
  it('should be able to get all of a users data by id', () => {
    let result = sleepRepo.getAllDataById(3000)
    expect(result).to.deep.equal([
      sleep1, 
      sleep3,
      sleep4,
      sleep5,
      sleep6,
      sleep7,
      sleep8,
      sleep0]);
    })
    // ^ could use an id sad path, but I think it would require if statements outside of the reduce.
  it('should know when an id is incorrect when getting all of a users data', () => {
    let result = sleepRepo.getAllDataById('abe')
    expect(result).to.equal('This id is incorrect');
  })
  
  it('should be able to sort a users data by date', () => {
    let result = sleepRepo.sortUserDataByDate(3000)
    expect(result).to.deep.equal([
      sleep8,
      sleep7,
      sleep6,
      sleep5,
      sleep4,
      sleep3, 
      sleep1,
      sleep0]);
  });

  it('should be able to pick a date from the most recent data', () => {
    let result = sleepRepo.getToday(3000)
    expect(result).to.equal('2040/01/10')
  })

  it('should be able to get most recent week of data for a given user', () => {
    let result = sleepRepo.getFirstWeek(3000)
    expect(result).to.deep.equal([
      sleep8,
      sleep7,
      sleep6,
      sleep5,
      sleep4,
      sleep3,
      sleep1])
  })

  it('should be able to get all data from a single day', ()=>{
    let result = sleepRepo.getAllDataByDay('2040/01/04')
    expect(result).to.deep.equal([sleep1, sleep2])
  })

  it('should only be able to get all data from a proper date', () => {
    let result = sleepRepo.getAllDataByDay(2030)
    expect(result).to.equal('This date is improperly formatted')
  })

  it('should be able to get all data in a week', () => {
    let result = sleepRepo.getAllDataByWeek('2040/01/10')
    expect(result).to.deep.equal([
      sleep1,
      sleep2,
      sleep3,
      sleep4,
      sleep5,
      sleep6,
      sleep7,
      sleep8])
  }) 
  //sad path: what if there's missing dates?
  it('should be able to get a Users the average for a week', () => {
    let result = sleepRepo.getUserAverageForWeek(3000, '2040/01/10', 'hoursSlept')
    expect(result).to.equal(23.1)
  })

  it('should be able to get all users average for a datapoint on a given day', () => {
    let result = sleepRepo.getAllUserAverageForDay('2040/01/04', 'hoursSlept')
    expect(result).to.equal(22.5)
  })
  
});

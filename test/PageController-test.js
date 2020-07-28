const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

import PageController from '../src/PageController'
import Repo from '../src/Repo';

describe('Page controller', () => {
  let page; 
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
  let repo;
  let rawSleep;
  let userRepo;
  let sleepRepo;
  let hydrationRepo;
  let activityRepo;

  let event = {
    target: {
      id: 'hydration'
    }
  }

  beforeEach(() => {
    global.document = {}
    chai.spy.on(document, ['querySelector', 'querySelectorAll'], () => {
      return [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}]
    })
    chai.spy.on(document, ['getElementById'], () => {
      return {
        value: '07/27/2020',
        children: {
          classList: () => {}
        }
      }  
    })
    page = new PageController();
    chai.spy.on(PageController, [
      'changeSystemMessage',
      'populateDailyData',
      'createWeeklyLayoutHtml',
      'insertWeekLayout',
      'createWeeklyLayout',
      'displayWeeklyData'
    ], () => {})

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
    rawSleep = [
      sleep1,
      sleep2,
      sleep3,
      sleep4,
      sleep5,
      sleep6,
      sleep7,
      sleep8,
      sleep0
    ]

    repo = new Repo();
    userRepo = new Repo();
    hydrationRepo = new Repo();
    activityRepo = new Repo();
    sleepRepo = new Repo();
    userRepo.storeData(rawUsers);
    hydrationRepo.storeData(rawHydration);
    activityRepo.storeData(rawActivity);
    sleepRepo.storeData(rawSleep);
  })
  
  afterEach(() => {
    chai.spy.restore()
  }) 
  
  it('should be a function', () => {
    expect(PageController).to.be.a('function')
  })
  
  it('should set a message to the DOM', () => {
    page.changeSystemMessage()
    expect(document.getElementById).to.have.been.called(2)
  })
  //the test sees instantiation on line 7 as well.
  //each test will therefor expect a getElementById and
  //two query selectors from the constructor
  it('should find the location of the first parameter', () => {
    page.populateDailyData('foo', ['bar'], 12, '12/80/20')
    expect(document.getElementById).to.have.been.called(2)
    expect(document.getElementById).to.have.been.called.with('foo')
  })

  it('should be able to insert HTML into a weekly layout', () => {
    page.insertWeekLayout('<br />')
    expect(document.querySelectorAll).to.have.been.called(1)
  })  

  it('should be able to return different html layouts in an object', () => {
    let result = page.createWeeklyLayoutHtml() 
    expect(result.weeklyHydration)
    expect(result.weeklyActivity)
    expect(result['weekly-sleep'])
  }) 

  // it('should populate 7 days of the week', () => {
  //   page.populateWeeklyData(hydrationRepo, 3000) 
  //   expect(document.querySelectorAll).to.have.been.called(1)
  //   expect(document.querySelectorAll).to.have.been.called.on('.historical-data')
  //   expect(document.getElementById).to.have.been.called(2)
  //   expect(page.populateDailyData).to.have.been.called(7)
  //   // cannot read property id of undefined
  // })

  // it('should display weekly data', () => {
  //   page.displayWeeklyData(event, 3000)
  //   expect(page.determineRepo).to.be.called(1)
  //   expect(page.createWeeklyLayoutHtml).to.be.called(1)
  //   expect(page.insertWeekLayout).to.be.called(1)
  //   expect(page.populateWeeklyData).to.be.called(1)
  // })
})
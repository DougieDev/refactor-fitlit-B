const chai = require('chai');
const expect = chai.expect;

const UserRepo = require('../src/UserRepo').default;
const User = require('../src/User').default;
const Repo = require('../src/Repo').default;
const ActivityRepo = require('../src/ActivityRepo').default;

describe('UserRepo',  () => {
  let user1, user2, users, userRepo, sleepRepo, activityRepo, hydrationRepo,
    activityData, hydrationData, sleepData;
  beforeEach( () => {

    user1 = new User({
      id: 1,
      name: 'Joshua Danger Sevy',
      address: "3000 Champions Lane, Mars",
      email: "google@gmail.com",
      strideLength: 458,
      dailyStepGoal: 1,
      friends: [1]
    });

    user2 = new User({
      id: 2,
      name: '#D0UG13',
      address: 'Inter-dimensional Palace',
      email: "google@gmail.com",
      strideLength: 4802,
      dailyStepGoal: 4802,
      friends: [3000]
    });

    activityData = [{
      "userID": 1,
      "date": "2019/06/15",
      "numSteps": 3577,
      "minutesActive": 140,
      "flightsOfStairs": 16
    },
    {
      "userID": 2,
      "date": "2019/06/15",
      "numSteps": 4294,
      "minutesActive": 138,
      "flightsOfStairs": 10
    },
    {
      "userID": 1,
      "date": "2019/06/16",
      "numSteps": 5000,
      "minutesActive": 12,
      "flightsOfStairs": 14
    },
    {
      "userID": 2,
      "date": "2019/06/16",
      "numSteps": 9303,
      "minutesActive": 45,
      "flightsOfStairs": 9
    },
    {
      "userID": 1,
      "date": "2019/06/17",
      "numSteps": 3000,
      "minutesActive": 62,
      "flightsOfStairs": 23
    },
    {
      "userID": 2,
      "date": "2019/06/17",
      "numSteps": 9303,
      "minutesActive": 4,
      "flightsOfStairs": 2
    }
    ];

    sleepData = [{
      "userID": 1,
      "date": "2019/06/15",
      "hoursSlept": 4,
      "sleepQuality": 0
    },
    {
      "userID": 2,
      "date": "2019/06/15",
      "hoursSlept": 6,
      "sleepQuality": 5
    },
    {
      "userID": 1,
      "date": "2019/06/16",
      "hoursSlept": 27,
      "sleepQuality": 8
    },
    {
      "userID": 2,
      "date": "2019/06/16",
      "hoursSlept": 18,
      "sleepQuality": 5
    },
    {
      "userID": 1,
      "date": "2019/06/17",
      "hoursSlept": 8,
      "sleepQuality": 5
    },
    {
      "userID": 2,
      "date": "2019/06/17",
      "hoursSlept": 4,
      "sleepQuality": 5
    }];

    hydrationData = [
      {
        "userID": 1,
        "date": "2019/06/15",
        "numOunces": 60
      },
      {
        "userID": 2,
        "date": "2019/06/15",
        "numOunces": 600
      },
      {
        "userID": 1,
        "date": "2019/06/16",
        "numOunces": 60
      },
      {
        "userID": 2,
        "date": "2019/06/16",
        "numOunces": 600
      }];

    users = [user1, user2];
    sleepRepo = new Repo();
    sleepRepo.storeData(sleepData);
    hydrationRepo = new Repo();
    hydrationRepo.storeData(hydrationData);
    activityRepo = new ActivityRepo;
    activityRepo.storeData(activityData);
    userRepo = new UserRepo();
    userRepo.storeData(users);
  });

  it('should be a function',  () => {
    expect(UserRepo).to.be.a('function')
  });

  it('should be an instance of UserRepo',  () => {
    expect(userRepo).to.be.an.instanceof(UserRepo)
  });

  it('should be able to store data',  () => {
    userRepo.storeData(users)

    expect(userRepo.data).to.deep.equal(users)
  });

  it('should be able to find a user by their ID',  () => {
    userRepo.storeData(users)
    userRepo.findUserById(1)
    let results = userRepo.findUserById(1)

    expect(results.name).to.equal('Joshua Danger Sevy')
  });

  it('should return the greatest steps user',  () => {
    expect(userRepo.getTopPerformer("2019/06/15", "numSteps", activityRepo))
      .to.be.an('object')
      .to.eql({name: '#D0UG13', activity: 4294 });
  })

  it('should return the most active user', function () {
    expect(userRepo.getTopPerformer("2019/06/15", "minutesActive", activityRepo))
      .to.be.an('object')
      .to.eql({ name: 'Joshua Danger Sevy', activity: 140 });
  })

  it('should return the most hydrated user', function () {
    expect(userRepo.getTopPerformer("2019/06/15", "numOunces", hydrationRepo)).to.eql({ name: '#D0UG13', activity: 600 });
  })

  it('should return the most rested user', function () {
    expect(userRepo.getTopPerformer("2019/06/15", "hoursSlept", sleepRepo)).to.eql({ name: '#D0UG13', activity: 6 });
  })
})

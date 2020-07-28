const chai = require('chai');
const expect = chai.expect;

const UserRepo = require('../src/UserRepo')
const User = require('../src/User')
const Repo = require('../src/Repo')
const ActivityRepo = require('../src/ActivityRepo')

describe('UserRepo', function() {
  let user1, user2, userRepo, sleepRepo, activityRepo, hydrationRepo;
  beforeEach(function() {
    user1 = new User ({
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
        "ate": "2019/06/15",
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
    userRepo = new UserRepo();
    activityRepo = new ActivityRepo;
    activityRepo.storeData(activityData);
    sleepRepo = new Repo();
    sleepRepo.storeData(sleepData);
    hydrationRepo = new Repo();
    hydrationRepo.storeData(hydrationData);
  });

  it('should be a function', function() {
    expect(UserRepo).to.be.a('function')
  });

  it('should be an instance of UserRepo', function() {
    expect(userRepo).to.be.an.instanceof(UserRepo)
  });

  it('should be able to store data', function() {
    userRepo.storeData(users)

    expect(userRepo.data).to.deep.equal(users)
  });

/* THE EXPECTATION HERE IS AN INSTANCEOF RESULT BECAUSE OF THE getRandomNumber
METHOD IT UTILIZES. THE USER IT GRABS IS ALMOST ALWAYS A DIFFERENT ONE */
  it('should be able to find the current user', function() {
    userRepo.storeData(users)

    expect(userRepo.currentUser).to.equal(null)
    userRepo.findCurrentUser()
    expect(userRepo.currentUser).to.be.an.instanceof(User)
  });

  it('should be able to find a user by their ID', function() {
    userRepo.storeData(users)
    userRepo.findUserById(1)
    let results = userRepo.findUserById(1)

    expect(results.name).to.equal('Joshua Danger Sevy')
  });

  it('should return a random number', function() {
    userRepo.getRandomNumber()

    expect(userRepo.getRandomNumber()).to.be.a('number')
  });

  it.only('should return the most active steps user', function() {
    expect(userRepo.getTopPerformer("2019/06/15", "numSteps", activityRepo)).to.eql({ name: 'Joshua Danger Sevy', activity: 3577 });
  })

  it.only('should return the most active steps user', function () {
    expect(userRepo.getTopPerformer("2019/06/15", "numSteps", activityRepo)).to.eql({ name: 'Joshua Danger Sevy', activity: 3577 });
  })

  it.only('should return the most active steps user', function () {
    expect(userRepo.getTopPerformer("2019/06/15", "numSteps", activityRepo)).to.eql({ name: 'Joshua Danger Sevy', activity: 3577 });
  })

  it.only('should return the most active steps user', function () {
    expect(userRepo.getTopPerformer("2019/06/15", "numSteps", activityRepo)).to.eql({ name: 'Joshua Danger Sevy', activity: 3577 });
  })
  // it.only('', function() {
  //   expect().to.equal()
  // })
})

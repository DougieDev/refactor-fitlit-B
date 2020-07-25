const chai = require('chai');
const expect = chai.expect;

const UserRepo = require('../src/UserRepo').default;
const User = require('../src/User').default;

describe('UserRepo', function() {
  let user1, user2, rawUsers, userRepo;
  beforeEach(function() {
    user1 = new User ({
      id: 3000,
      name: 'Joshua Danger Sevy',
      address: "3000 Champions Lane, Mars",
      email: "google@gmail.com",
      strideLength: 458,
      dailyStepGoal: 1,
      friends: [1]
    });
    user2 = new User({
      id: 1,
      name: '#D0UG13',
      address: 'Inter-dimensional Palace',
      email: "google@gmail.com",
      strideLength: 4802,
      dailyStepGoal: 4802,
      friends: [3000]
    });
    users = [user1, user2];
    userRepo = new UserRepo();
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
    userRepo.findUserById(3000)
    let results = userRepo.findUserById(3000)

    expect(results.name).to.equal('Joshua Danger Sevy')
  });

  it('should return a random number', function() {
    userRepo.getRandomNumber()

    expect(userRepo.getRandomNumber()).to.be.a('number')
  });

/* COME BACK TO THIS */
  // it('should be able to isolate the username and relevant data', function() {
  //   userRepo.isolateUsernameAndRelevantData()
  //   expect().to.equal()
  // })
})

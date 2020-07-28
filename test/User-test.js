const chai = require('chai');
const expect = chai.expect;

const User = require('../src/User').default;

describe('User', function() {
  let user1, user2, user3, user4;
  let mockUserStorage
  beforeEach(function() {
    user1 = new User({
      id: 1,
      name: "Alex Roth",
      address: "1234 Turing Street, Denver CO 80301-1697",
      email: "alex.roth1@hotmail.com",
      strideLength: 4.3,
      dailyStepGoal: 10000,
      friends: [2, 3, 4]
    });
    user2 = new User({
      id: 2,
      name: "Allie McCarthy",
      address: "1235 Turing Street, Denver CO 80301-1697",
      email: "allie.mcc1@hotmail.com",
      strideLength: 3.3,
      dailyStepGoal: 9000,
      friends: [1, 3, 4]
    });
    user3 = new User({
      id: 3,
      name: "The Rock",
      address: "1236 Awesome Street, Denver CO 80301-1697",
      email: "therock@hotmail.com",
      strideLength: 10,
      dailyStepGoal: 60000,
      friends: [1, 2, 4]
    });
    user4 = new User({
      id: 4,
      name: "Rainbow Dash",
      address: "1237 Equestria Street, Denver CO 80301-1697",
      email: "rainbowD1@hotmail.com",
      strideLength: 3.8,
      dailyStepGoal: 7000,
      friends: [1, 2, 3]
    });
    mockUserStorage = [user1, user2, user3, user4]
  });

  it('should be a function', function() {
    expect(User).to.be.a('function')
  });

  it('should be an instance of User', function() {
    expect(user1).to.be.an.instanceof(User)
  });

  it('should have a name', function() {
    expect(user1.name).to.equal('Alex Roth')
  });

  it('should be able to have a different name', function() {
    expect(user2.name).to.equal('Allie McCarthy')
  });

  it('should have an id', function() {
    expect(user1.id).to.equal(1)
  });

  it('should be able to have a different id', function() {
    expect(user2.id).to.equal(2)
  });

  it('should have an address', function() {
    expect(user1.address).to.equal("1234 Turing Street, Denver CO 80301-1697")
  });

  it('should be able to have a different address', function() {
    expect(user2.address).to.equal('1235 Turing Street, Denver CO 80301-1697')
  });

  it('should have an email address', function() {
    expect(user1.email).to.equal('alex.roth1@hotmail.com')
  });

  it('should be able to have a different email address', function() {
    expect(user2.email).to.equal('allie.mcc1@hotmail.com')
  });

  it('should have a stride length', function() {
    expect(user1.strideLength).to.equal(4.3)
  });

  it('should have a different stride length', function() {
    expect(user2.strideLength).to.equal(3.3)
  });

  it('should have a daily step goal', function() {
    expect(user1.dailyStepGoal).to.equal(10000)
  });

  it('should be able to have a different daily step goal', function() {
    expect(user2.dailyStepGoal).to.equal(9000)
  });


  it('should have friends', function() {
    expect(user1.friends).to.deep.equal([2, 3, 4])
  });

  it('should have a different set of friends', function() {
    expect(user2.friends).to.deep.equal([1, 3, 4])
  });

  it('should be able to return a users first name', function() {
    user1.getFirstName()

    expect(user1.getFirstName()).to.equal('Alex')
  });

  it('should be able to see their friends names', function() {
    user1.getFriendsNames(mockUserStorage)

    expect(user1.getFriendsNames(mockUserStorage)).to.deep.equal([
      'Allie McCarthy', 
      'The Rock', 
      'Rainbow Dash'
    ])
  });

})

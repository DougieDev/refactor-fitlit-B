class User {
  constructor(userDetails) {
    this.userID = userDetails.id;
    this.name = userDetails.name;
    this.address = userDetails.address;
    this.email = userDetails.email;
    this.strideLength = userDetails.strideLength;
    this.dailyStepGoal = userDetails.dailyStepGoal;
    this.friends = userDetails.friends;

  }
  //CALLED FOR IN FITLIT SPEC CLASS LOOKS GOOD
  //works as expected returns first name of user.
  getFirstName() {
    return this.name.split(' ', 1).join();
  }
  //ALSO IN FITLIT SPEC
  // User-repo needs to be instantiated for this to work since it holds the userdata
  // this could be refactored to grab directly from data if need be or from api.
  getFriendsNames(userStorage) {
    return this.friends.map((friendId) => (userStorage.getDataFromID(friendId).name));
  }

  getFriendsAverageStepsForWeek(user, date, userRepo) {
    let friendsActivity = this.getFriendsActivity(user, userRepo);
    let timeline = this.chooseWeekDataForAllUsers(friendsActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData(friendsActivity, date, 'numSteps', timeline)
  }

  getFriendsActivity(user, userRepo) {
    let data = this.activityData;
    let userDatalist = user.friends.map(friend => {
      return userRepo.getDataFromUserID(friend, data)
    });
    return userDatalist.reduce(function (arraySoFar, listItem) {
      return arraySoFar.concat(listItem);
    }, []);
  }
}

export default User;

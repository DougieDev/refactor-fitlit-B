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

  findUserById() {
    return this.data.find((dataPoint) => {
      return dataPoint.userID === id && dataPoint.date === date;
    });
  }
  getFirstName() {
    return this.name.split(' ', 1).join();
  }

  getFriendsNames(userStorage) {
    return this.friends.map((friendId) => (userStorage.getDataFromID(friendId).name));
  }

  getFriendsActivity() {
    return this.friends.reduce((friendsActivities, friend) => {
      friendsActivities = friendsActivities.concat(activityRepo.getAllDataById(friend))
      return friendsActivities
    }, [])
  }

  getFriendsAverageStepsForWeek(date, userRepo) {
    let friendsActivity = this.getFriendsActivity();
    let timeline = this.getAllDataByWeek(friendsActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData(friendsActivity, date, 'numSteps', timeline)
  }
}

export default User;


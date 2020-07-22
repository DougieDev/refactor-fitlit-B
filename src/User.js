//User Repo needs to be instantiated first it holds all data for all users


class User {
  constructor(userDetails) {
    this.id = userDetails.id;
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
}

export default User;

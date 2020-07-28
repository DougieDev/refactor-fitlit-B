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

  getFirstName() {
    return this.name.split(' ', 1).join();
  }

  getFriendsNames(userStorage) {
    return this.friends.map(friendId => {
      return this.findFriendById(userStorage, friendId).name;
    })
  }

  findFriendById(userStorage, friendId) {
    return userStorage.find(user => {
      return user.id === friendId
    })
  }

  getFriendsActivity() {
    return this.friends.reduce((friendsActivities, friend) => {
      friendsActivities = friendsActivities.concat(activityRepo.getAllDataById(friend))
      return friendsActivities
    }, [])
  }
}

export default User;

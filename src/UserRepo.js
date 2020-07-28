import Repo from './Repo'

class UserRepo extends Repo  {
  constructor(usersData) {
    super(usersData)
    
  }

  findUserById(id) {
    return this.data.find(dataPoint => dataPoint.id === id)
  }
  
  getTopPerformer(date, activityType, repo) {
    const winnerData = repo.getAllDataByDay(date);
    let topPerformer = winnerData.reduce((compare, currentValue) => {
      return (compare[activityType] > currentValue[activityType] 
        ? compare : currentValue);
    });
    const user = this.findUserById(topPerformer.userID);

    topPerformer = {
      name: user.name,
      activity: topPerformer[activityType]
    }
    return topPerformer;
  }
}

export default UserRepo;

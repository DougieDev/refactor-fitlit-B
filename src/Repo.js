import Hydration from './Hydration';
import Sleep from './Sleep';
import Activity from './Activity';
import User from './User';

class Repo {
  storeData(data, src) {
    if (src === 'userData') {
      this.users = data.map(datum => new User(datum)); 
    } else if (src === 'hydrationData') {
      this.hydration = data.map(datum => new Hydration(datum));
    } else if (src === 'sleepData') {
      this.sleep = data.map(datum => new Sleep(datum));
    } else if (src === 'activityData') {
      this.activity = data.map(datum => new Activity(datum));
    }
  }
}

export default Repo
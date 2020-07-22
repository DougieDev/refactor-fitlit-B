import Activity from './Activity'

class ActivityRepo {
  storeData(data) {
    this.activity = data.map(data => new Activity(data));
  }
}

export default ActivityRepo
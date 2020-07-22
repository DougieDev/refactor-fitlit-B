import Activity from './Activity'

class ActivityRepo {
  constructor(data) {
    this.repo = this.makeActivities(data);
  }

  makeActivities(data) {
    return data.map(data => new Activity(data));
  }
}

export default ActivityRepo
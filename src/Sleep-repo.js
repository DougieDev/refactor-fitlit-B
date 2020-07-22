import Sleep from './Sleep'

class SleepRepo {
  storeData(data) {
    this.sleep = data.map(data => new Sleep(data));
  }
}

export default SleepRepo
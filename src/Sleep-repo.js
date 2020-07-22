import Sleep from './Sleep'

class SleepRepo {
  constructor(data) {
    this.repo = this.makeSleep(data);
  }

  makeSleep(data) {
    return data.map(data => new Sleep(data));
  }
}

export default SleepRepo
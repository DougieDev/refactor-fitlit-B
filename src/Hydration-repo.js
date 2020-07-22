import Hydration from './Hydration';

class HydrationRepo {
  storeData(data) {
    this.hydration = data.map(datum => new Hydration(datum));
  }
}

export default HydrationRepo;
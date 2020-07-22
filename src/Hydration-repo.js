import Hydration from './Hydration';

class HydrationRepo {
  constructor(data) {
    this.repo = this.makeHydration(data);
  }

  makeHydration(data) {
    return data.map(datum => new Hydration(datum));
  }
}

export default HydrationRepo;
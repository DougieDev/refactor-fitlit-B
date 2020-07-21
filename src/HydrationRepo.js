import Hydration from './Hydration';

class HydrationRepo {
  constructor(data) {
    this.repository = this.makeData(data);
  }

  makeData(ary) {
    // console.log(ary);
    return ary.map(datum => new Hydration(datum));
  }
}

export default HydrationRepo;
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies); 

describe('scripts', () => {
  beforeEach(() => {
    const windowRef = global.window; 
    global.window = {document: {querySelector: () => {}}}
    global.window = windowRef
  })

  it('should know where the API is', () => {
    expect(apiHead).to.equal('https://fe-apps.herokuapp.com/api/v1/fitlit/1908')
  })
})
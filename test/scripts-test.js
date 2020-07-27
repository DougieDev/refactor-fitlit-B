const chai = require('chai')
const spies = require('chai-spies');
chai.use(spies); 

describe('scripts', () => {
  beforeEach(() => {
    const windowRef = global.window; 
    global.window = {document: {querySelector: () => {}}}
    global.window = windowRef

  })
})
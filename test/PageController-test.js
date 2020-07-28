const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

import PageController from '../src/PageController'

describe('scripts', () => {
  beforeEach(() => {
    const windowRef = global.window;
    global.window = { document: { querySelector: () => { } } }
    global.window = windowRef
  })
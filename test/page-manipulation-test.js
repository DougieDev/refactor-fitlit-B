const chai = require('chai')
const expect = chai.expect
// const spies = require('chai-spies')
// chai.use(spies)
import DOMmanipulator from '../src/page-manipulation'
// import Pikaday from 'pikaday'
import { each } from 'jquery';

describe('DOMmanipulator', () => {
  let page;
  beforeEach(() => {
    page = new DOMmanipulator
  })
  describe('page', () => { 
    it('should be an instance of the DOMmanipulator', () => {
      expect(page).to.be.an.instance.of(DOMmanipulator)
    }) 
  })
})
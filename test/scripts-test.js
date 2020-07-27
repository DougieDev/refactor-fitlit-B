import expect from 'chai';
const spies = require('chai-spies')
chai.use(spies)
import DOMmanipulator from '../src/page-manipulation'
import {
  apiHead,
  page,
  currentUser,
  today,
  sideBar,
  selectBar,
  buttons,
  buttonHandler,
  sidebarHandler,
  dataEventHandler,
  startApp,
  catchAllData,
  postAllData,
  postData,
  catchData,
  findClassInfo,
  makePostObject,
  organizePost 
} from '../src/scripts'
describe('scripts', () => {

  // let window = {
  //   document: {
  //     querySelector: () => {}
  //   },
  // };
  // beforeEach(() => {
  //   // document.querySelector = () => {};
  //   chai.spy.on(window, ['document.querySelector'], () => {})
  // })
  describe('global variables', () => {
    it.skip('should have the API url head', () => {
      expect(apiHead).to.equal('https://fe-apps.herokuapp.com/api/v1/fitlit/1908')
    });
    
    it.skip('should have access to an object which will manipulate the page', () => {
      expect(page).to.be.an.instanceOf(DOMmanipulator)
    });
    
    // it.skip('should be able to assign current user and today\'s date', () => {
    //   expect(currentUser).to.equal(undefined)
    //   expect(today).to.equal(undefined)
    // });
    
    it.skip('should access the sideBar node', () => {
      // expect(sideBar) 
    })
  })
})
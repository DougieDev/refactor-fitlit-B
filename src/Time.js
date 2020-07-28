import moment from 'moment';
import Pikaday from 'pikaday';
import Repo from './Repo.js'
import {page} from './scripts.js';

// We acknowledge this class probably isn't best practice (addCalendar originally)
// lived in DOMmanipulation and findWeeklyStartDates lived in Repo. They've been 
// moved here because they were not playing nicely with testing for either file.

// You may have noticed there was also an untested repo parameter getting passed through
// from repo.sortDataByDate to repo.getAllDataById - where it receives a default definition
// This was a last minute change in order to support the rehousing of moment.

class Time extends Repo {

  addCalendar(id) {
    const pikaday = new Pikaday({
      field: document.getElementById('calendar-container'),
      bound: false,
      container: document.getElementById('calendar-container'),
      disableDayFn: (date) => {
        date = moment(date).format('YYYY/MM/DD')
        const datesWithData = page.findEligibleDates(id)
        if (!datesWithData.includes(date)) return date
      },
      onSelect: () => {
        let calDate = pikaday.getMoment().format('YYYY/MM/DD');
        page.goToDailyPage(calDate)
        page.changeSystemMessage('Here are your stats form ' +
          `${moment(calDate).format('MMMM Do YYYY')}`)
      }
    })
  }

  findWeeklyStartDates(id, repo) {
    // debugger
    const sortedData = this.sortUserDataByDate(id, repo.data);
    return sortedData.reduce((mondays, dataPoint) => {
      if (moment(dataPoint.date).format("dddd") === "Monday") {
        mondays.push(dataPoint.date);
      }
      return mondays;
    }, []);
  }
}


export default Time;
import moment from 'moment';
import Pikaday from 'pikaday';
import {page} from './scripts.js';

const addCalendar = (id) => {
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

export default addCalendar;
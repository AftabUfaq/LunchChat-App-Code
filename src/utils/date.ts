import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s', // %s ago
    s: '%ds',
    ss: '%ds',
    m: '%dm',
    mm: '%dm',
    h: '%dh',
    hh: '%dh',
    d: '%dd',
    dd: '%dd',
    w: '%dw',
    ww: '%dw',
    M: '%dM',
    MM: '%dM',
    y: '%dY',
    yy: '%dY',
  },
});
moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24);
moment.relativeTimeThreshold('d', 7);
moment.relativeTimeThreshold('w', 52);

export const convertTimestamp = (timeObj: {
  seconds?: number;
  nanoseconds?: number;
}): Date => {
  // Adjusted to use the new Timestamp import
  return new Timestamp(timeObj.seconds || 0, timeObj.nanoseconds || 0).toDate();
};

export const formatEventDateString = (
  startDate?: Date,
  endDate?: Date
): string => {
  const startTime = moment(startDate).format('HH:mm');
  const endTime = moment(endDate).format('HH:mm');
  const date = moment(startDate).format('ddd DD MMM');
  return `${date}, ${startTime} — ${endTime} `;
};

export const fromNow = (date: Date): string => moment(date).fromNow();

import moment from 'moment';


export const formatTime = (time) => {
  if (time === null || time === undefined) {
    return '--';
  }
  return moment(time).format('YYYY-MM-DD HH:mm');
};

export const formatTimeLess = (time) => {
  if (time === null || time === undefined) {
    return '--';
  }
  return moment(time).format('YYYY-MM-DD');
};

export const formatTimeDiff = (time) => {
  if (time === null || time === undefined) {
    return '--';
  }
  return moment(time).format('YYYY/MM/DD');
};

import {queryLike} from '../services/api';

export const queryGonghao = (value, callback) => {
  let gongHao = '';
  queryLike(value)
    .then((res) => {
      res.map((it) => {
        if (it.name === value) {
          gongHao = it.employeeNumber;
          callback(gongHao);
        }
      });
    });
};

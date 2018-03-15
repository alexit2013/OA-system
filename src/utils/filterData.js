export const filtrate = (arr, str) => {
  const reaultArr = [];
  arr.map((it) => {
    let flag = false;
    if (it[str] === '' || it[str] === null) {
      return null;
    }
    reaultArr.map((item) => {
      if (item.value === it[str]) {
        flag = true;
        return null;
      }
    });
    if (!flag) {
      reaultArr.push({text: it[str], value: it[str]});
    }
  });
  return reaultArr;
}
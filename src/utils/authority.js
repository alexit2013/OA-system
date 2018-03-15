const juris = (value) => {
  let flag = false;
  const data = JSON.parse(sessionStorage.getItem('user')).t.role.split(',');
  data.map((item) => {
    if (item === value) {
      flag = true;
    }
  });
  return flag;
};
export const findIdentity = () => {
  const identity = {};
  identity.employeeNumber = JSON.parse(sessionStorage.getItem('user')).t.employeeNumber;
  identity.name = JSON.parse(sessionStorage.getItem('user')).t.name;
  return identity;
};
export const isAsset = () => {
  return sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).t && juris('assetManager');
};
export const isAdmin = () => {
  return sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).t && juris('admin');
};
export const isHr = () => {
  return sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).t && juris('hr_recruit');
};

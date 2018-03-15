import React from 'react';
import { Link } from 'dva/router';
import Exception from '../../components/Exception';

export default () => (
  <Exception type="403" style={{ width: '100%', height: '800px' }} linkElement={Link} />
);

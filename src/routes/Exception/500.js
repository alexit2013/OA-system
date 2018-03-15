import React from 'react';
import { Link } from 'dva/router';
import Exception from '../../components/Exception';

export default () => {
  return (
    <Exception type="500" style={{ width: '100%', height: '800px' }} linkElement={Link} />
  )
}

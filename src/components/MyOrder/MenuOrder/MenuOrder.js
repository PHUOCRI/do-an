import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuOrders } from '../../actions/menuOrderActions';
import { userInfoSelector } from '../../selectors/userSelectors';

const MenuOrder = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(userInfoSelector);

  useEffect(() => {
    dispatch(getMenuOrders());
  }, [dispatch, userInfo._id]);

  return (
    <div>MenuOrder Component</div>
  );
};

export default MenuOrder; 
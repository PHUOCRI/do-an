import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getOrders } from '../../actions/orderActions';
import { useSelector } from 'react-redux';

const AllOrder = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return (
    <div>
      {orders.map((item) => (
        <div key={item._id}>
          <img src={item.image} alt={item.name} />
        </div>
      ))}
    </div>
  );
};

export default AllOrder; 
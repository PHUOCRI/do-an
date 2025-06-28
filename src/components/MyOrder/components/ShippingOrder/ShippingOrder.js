import React, { useEffect } from 'react';

const ShippingOrder = () => {
  const userInfo = { _id: 'user123' }; // Replace with actual user info

  useEffect(() => {
    // Add userInfo._id to dependency array
  }, [userInfo._id]);

  return (
    <img src={item.image} alt={item.name} />
  );
};

export default ShippingOrder; 
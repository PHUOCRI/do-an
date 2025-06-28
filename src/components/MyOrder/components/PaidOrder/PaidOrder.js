import React, { useEffect } from 'react';

const PaidOrder = () => {
  const userInfo = { _id: 'user123' }; // Replace with actual user info

  useEffect(() => {
    // Add userInfo._id to dependency array
  }, [userInfo._id]);

  return (
    <div>
      {/* Rest of the component content */}
    </div>
  );
};

export default PaidOrder; 
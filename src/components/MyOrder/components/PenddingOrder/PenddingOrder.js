import React, { useEffect } from 'react';

const PenddingOrder = () => {
  const [items, setItems] = React.useState([]);

  useEffect(() => {
    // Fetch items
  }, []);

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <img src={item.image} alt={item.name} />
        </div>
      ))}
    </div>
  );
};

export default PenddingOrder; 
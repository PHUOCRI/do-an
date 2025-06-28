import React, { useEffect, useRef } from 'react';

const socketRef = useRef(null);

useEffect(() => {
  socketRef.current = socket;
  // ... existing code ...
}, [dispatch]);

useEffect(() => {
  // ... existing code ...
}, [dispatch]);

// ... existing code ... 
import React from 'react';

<img src={product.image} alt={product.name || ''} onError={e => {e.target.onerror=null; e.target.src='/img/default.jpg';}} /> 
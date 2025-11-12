import { useState } from 'react';

function openNameBox() {
  // 1. Initialize state based on Local Storage or default to open
  const [isNameProvided, setIsNameProvided] = useState(() => {
    const name = localStorage.getItem('name');
    return name !== null && name.length > 0;
  });
  
  return [isNameProvided, setIsNameProvided];
}

export default openNameBox;
import React, { useState } from 'react';
import { Check } from 'lucide-react';

const NameBox = ({ onNameSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (name.length === 0) {
      if (error === '') {
        setError('בבקשה הקלידו את שמכם');
        return;
      }
      else if (error === 'בבקשה הקלידו את שמכם') {
        setError('בבקשה בבקשה הקלידו את שמכם');
        return;
      }
      else if (error === 'בבקשה בבקשה הקלידו את שמכם') {
        setError('בבקשה בבקשה בבקשה הקלידו את שמכם');
        return;
      }
      else if (error === 'בבקשה בבקשה בבקשה הקלידו את שמכם') {
        setError('אל תגרמו לי להתחנן');
        return;
      }
      else {
        setError('אל תגרמו לי להתחנן');
        return;
      }
    }
    if (name.length > 18) {
      setError('ארוך מדי, בבקשה הקלידו שם קצר יותר');
      return;
    }
    setError('');
    localStorage.setItem('name', name);
    onNameSubmit(name);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative rounded-lg w-96 p-4 bg-white dark:bg-gray-800 shadow-lg">
        <input 
          placeholder="הזינו את שמכם" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="relative bg-transparent ring-0 outline-none border border-neutral-500 placeholder-gray-800 dark:placeholder-gray-100 text-gray-800 dark:text-gray-100 text-lg rounded-lg focus:ring-gray-800 placeholder-opacity-60 dark:focus:border-gray-200 block w-full text-right p-4 font-bold mb-4" 
          type="text" 
        />
        {error && <p className="text-red-500 text-sm mb-4 text-right">{error}</p>}
        <button 
          onClick={handleSubmit} 
          className="absolute left-3 bottom-3 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg focus:outline-none"
          aria-label="Submit Name"
        >
          <Check size={24} />
        </button>
      </div>
    </div>
  );
};

export default NameBox;

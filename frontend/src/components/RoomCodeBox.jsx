import React from 'react';

const RoomCodeBox = () => {
  return (
    <div className="flex relative rounded-lg w-32 overflow-hidden before:absolute before:w-6 before:h-12 before:content[''] before:left-0 before:bg-yellow-500 before:rounded-full before:blur-lg after:absolute after:-z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-12 after:top-3 after:rounded-full after:blur-lg">
      <input 
        placeholder="הזן קוד חדר" 
        className="relative bg-transparent ring-0 outline-none border border-neutral-500 placeholder-yellow-800 dark:placeholder-yellow-300 text-yellow-600 dark:text-yellow-400 text-sm rounded-lg focus:ring-yellow-500 placeholder-opacity-60 focus:border-yellow-500 block w-full text-right p-2.5 checked:bg-emerald-500 font-bold" 
        type="text" 
      />
    </div>
  );
}

export default RoomCodeBox;

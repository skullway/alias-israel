import React, { useState } from 'react';

const RoomCodeBox = () => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleJoinRoom = async () => {
    const name = localStorage.getItem('name');

    if (!roomCode.trim()) {
      setError('כאן רושמים את קוד החדר');
      return;
    }

    if (!name) {
      setError('אין לך שם גבר. תרענן את הדף ותכניס שם');
      return;
    }

    try {
      const response = await fetch(`/api/rooms/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomCode, name }),
      });

      if (response.status === 404) {
        setError('חדר לא נמצא. בדוק את קוד החדר ונסה שוב.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to join room: ${response.status}`);
      }

      const roomData = await response.json();
      console.log('Joined room:', roomData);
      alert(`היידה התחברנו ל: ${roomData.code}!`); // Use 'code' instead of 'name'
    } catch (error) {
      console.error('Error joining room:', error);
      setError('אירעה שגיאה בלתי צפויה. אנא נסה שוב.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="relative">
      <div className="flex relative rounded-lg w-32 overflow-hidden before:absolute before:w-6 before:h-12 before:content[''] before:left-0 before:bg-yellow-500 before:rounded-full before:blur-lg after:absolute after:-z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-12 after:top-3 after:rounded-full after:blur-lg">
        <input 
          placeholder="הזן קוד חדר" 
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="relative bg-transparent ring-0 outline-none border border-neutral-500 placeholder-yellow-800 dark:placeholder-yellow-300 text-yellow-600 dark:text-yellow-400 text-sm rounded-lg focus:ring-yellow-500 placeholder-opacity-60 focus:border-yellow-500 block w-full text-right p-2.5 checked:bg-emerald-500 font-bold" 
          type="text" 
        />
      </div>
      {error && <p className="absolute text-red-500 text-sm mt-2 text-right -left-40">{error}</p>}
    </div>
  );
};

export default RoomCodeBox;

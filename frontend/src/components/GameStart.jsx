import React from 'react';
import PropTypes from 'prop-types';

const GameStart = ({ roomData, onStartGame, onCloseRoom }) => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 rounded-xl shadow-2xl space-y-6 border border-gray-100 dark:border-gray-700 rtl">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 border-b pb-3 mb-4 text-center">
        {/* You can use the room name here if you want */}
        {roomData.name || 'התחלת משחק'}
      </h2>

      {/* Room Code Display */}
      {roomData.code && (
        <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            הזמינו חברים עם קוד החדר:
          </p>
          <div className="inline-flex items-center justify-center p-3 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
            <span className="text-3xl font-bold tracking-widest text-blue-600 dark:text-blue-400">
              {roomData.code}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            שחקנים אחרים יוכלו להצטרף באמצעות קוד זה.
          </p>
        </div>
      )}


      {/* Room Details */}
      <div className="space-y-4">
        <p><strong>שם החדר:</strong> {roomData.name}</p>
        <p><strong>מקור מילים:</strong> {roomData.wordSource === 'vocabulary' ? 'אוצר מילים קיים' : 'רשימת מילים מותאמת אישית'}</p>
        {roomData.wordSource === 'vocabulary' && <p><strong>אוצר מילים נבחר:</strong> {roomData.selectedVocabularyId}</p>}
        {roomData.wordSource === 'custom' && <p><strong>מילים מותאמות אישית:</strong> {roomData.customWords}</p>}
      </div>

      {/* Connected Users */}
      <div>
        <h3 className="text-xl font-bold mb-2">משתמשים מחוברים:</h3>
        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {roomData.players.map((player) => (
            <li key={player.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 border rounded-lg">
              <span>{player.name}</span>
              <div className={`w-6 h-6 rounded-full ${player.teamColor} border-2 border-gray-300`}></div>
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onStartGame}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150"
        >
          התחל משחק
        </button>
        <button
          onClick={onCloseRoom}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150"
        >
          סגור חדר וחזור
        </button>
      </div>
    </div>
  );
};

GameStart.propTypes = {
  roomData: PropTypes.object.isRequired,
  onStartGame: PropTypes.func.isRequired,
  onCloseRoom: PropTypes.func.isRequired,
};

export default GameStart;
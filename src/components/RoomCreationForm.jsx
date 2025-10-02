import React, { useState } from 'react';

// Faking the vocabulary list options
const FAKE_VOCABULARIES = [
  { id: 'v1', name: 'אוצר מילים כללי' }, // General Vocabulary
  { id: 'v2', name: 'מדעי המחשב' }, // Computer Science
  { id: 'v3', name: 'טבע ובעלי חיים' }, // Nature and Animals
];

// Simple team color options
const TEAM_COLORS = [
  { name: 'אדום', color: 'bg-red-500', value: 'red' },
  { name: 'כחול', color: 'bg-blue-500', value: 'blue' },
  { name: 'ירוק', color: 'bg-green-500', value: 'green' },
  { name: 'צהוב', color: 'bg-yellow-500', value: 'yellow' },
];

const RoomCreationForm = ({ onSubmit }) => {
  // State for all room settings
  const [roomSettings, setRoomSettings] = useState({
    name: 'חדר חדש', // New Room
    wordSource: 'vocabulary', // 'vocabulary' or 'custom'
    selectedVocabularyId: FAKE_VOCABULARIES[0].id,
    customWords: '',
    players: [
      { id: Date.now(), name: 'שחקן 1', teamColor: TEAM_COLORS[0].value },
    ],
  });

  // State for the new player form inputs (to manage adding players)
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerColor, setNewPlayerColor] = useState(TEAM_COLORS[1].value);

  // --- Handlers for Form Changes ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleWordSourceChange = (e) => {
    setRoomSettings(prev => ({
      ...prev,
      wordSource: e.target.value,
      // Reset dependent fields when source changes
      selectedVocabularyId: e.target.value === 'vocabulary' ? FAKE_VOCABULARIES[0].id : '',
      customWords: e.target.value === 'custom' ? '' : prev.customWords,
    }));
  };

  // --- Handlers for Player Management ---

  const addPlayer = () => {
    if (newPlayerName.trim() === '') return;

    const newPlayer = {
      id: Date.now(),
      name: newPlayerName.trim(),
      teamColor: newPlayerColor,
    };

    setRoomSettings(prev => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));

    // Reset new player inputs
    setNewPlayerName('');
    setNewPlayerColor(TEAM_COLORS.find(c => c.value !== newPlayerColor)?.value || TEAM_COLORS[0].value); // Pick a different color for the next one
  };

  const removePlayer = (playerId) => {
    setRoomSettings(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId),
    }));
  };

  const handlePlayerDetailChange = (id, field, value) => {
    setRoomSettings(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === id ? { ...player, [field]: value } : player
      ),
    }));
  };

  // --- Handler for Final Submission ---

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final clean-up and packaging of data
    const finalRoomData = {
      ...roomSettings,
      // Process custom words into an array if the source is 'custom'
      processedWords: roomSettings.wordSource === 'custom'
        ? roomSettings.customWords.split(',').map(word => word.trim()).filter(word => word.length > 0)
        : null, // or undefined, or the ID of the selected vocabulary
    };

    // Call the parent function with the neatly packed object
    onSubmit(finalRoomData);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-2xl space-y-6 border border-gray-100 **rtl**">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-4 text-center">
        יצירת חדר חדש 🚪
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* --- 1. Room Name --- */}
        <div>
          <label htmlFor="room-name" className="block text-lg font-medium text-gray-700 mb-1">
            שם החדר
          </label>
          <input
            id="room-name"
            type="text"
            name="name"
            value={roomSettings.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right"
          />
        </div>

        {/* --- 2. Word Source Selection --- */}
        <fieldset className="border p-4 rounded-lg space-y-3">
          <legend className="text-lg font-medium text-gray-700 px-2">
            בחירת מקור מילים
          </legend>

          {/* Vocabulary Option */}
          <div className="flex items-center space-x-3 **space-x-reverse**">
            <input
              id="source-vocab"
              type="radio"
              name="wordSource"
              value="vocabulary"
              checked={roomSettings.wordSource === 'vocabulary'}
              onChange={handleWordSourceChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="source-vocab" className="text-base text-gray-700">
              שימוש באוצר מילים קיים
            </label>
          </div>
          {roomSettings.wordSource === 'vocabulary' && (
            <select
              name="selectedVocabularyId"
              value={roomSettings.selectedVocabularyId}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-right"
            >
              {FAKE_VOCABULARIES.map(vocab => (
                <option key={vocab.id} value={vocab.id}>
                  {vocab.name}
                </option>
              ))}
            </select>
          )}

          {/* Custom Words Option */}
          <div className="flex items-center pt-2 space-x-3 **space-x-reverse**">
            <input
              id="source-custom"
              type="radio"
              name="wordSource"
              value="custom"
              checked={roomSettings.wordSource === 'custom'}
              onChange={handleWordSourceChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="source-custom" className="text-base text-gray-700">
              שימוש ברשימת מילים משלי
            </label>
          </div>
          {roomSettings.wordSource === 'custom' && (
            <textarea
              name="customWords"
              value={roomSettings.customWords}
              onChange={handleInputChange}
              placeholder="הכנס מילים, מופרדות בפסיקים (לדוגמה: תפוח, בננה, לימון)"
              rows="3"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 resize-none text-right"
            ></textarea>
          )}
        </fieldset>
        
        {/* --- 3. Players Management --- */}
        <fieldset className="border p-4 rounded-lg space-y-4">
          <legend className="text-lg font-medium text-gray-700 px-2">
            שחקנים (סה"כ: {roomSettings.players.length}) 🧑‍🤝‍🧑
          </legend>

          {/* List of Current Players */}
          <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {roomSettings.players.map((player) => (
              <li
                key={player.id}
                className="flex items-center justify-between p-2 bg-gray-50 border rounded-lg"
                dir="rtl" // Ensure inner list items follow RTL
              >
                <div className="flex-grow space-x-3 **space-x-reverse** items-center flex">
                    <input
                        type="text"
                        value={player.name}
                        onChange={(e) => handlePlayerDetailChange(player.id, 'name', e.target.value)}
                        className="py-1 px-2 border rounded-md text-right flex-grow max-w-xs"
                    />

                    <select
                        value={player.teamColor}
                        onChange={(e) => handlePlayerDetailChange(player.id, 'teamColor', e.target.value)}
                        className="py-1 px-2 border rounded-md bg-white text-right max-w-[150px]"
                    >
                        {TEAM_COLORS.map((color) => (
                            <option key={color.value} value={color.value}>
                                {color.name}
                            </option>
                        ))}
                    </select>
                    <div className={`w-6 h-6 rounded-full ${TEAM_COLORS.find(c => c.value === player.teamColor)?.color} border-2 border-gray-300`}></div>
                </div>

                <button
                  type="button"
                  onClick={() => removePlayer(player.id)}
                  className="mr-3 text-red-500 hover:text-red-700 transition duration-150 font-bold text-lg leading-none"
                  aria-label="הסר שחקן"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
          
          <hr className="my-4" />

          {/* Add Player Controls */}
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="שם שחקן חדש"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-right"
            />
            <select
              value={newPlayerColor}
              onChange={(e) => setNewPlayerColor(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg bg-white text-right"
            >
              {TEAM_COLORS.map((color) => (
                <option key={`new-${color.value}`} value={color.value}>
                  {color.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addPlayer}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 flex-shrink-0"
              disabled={newPlayerName.trim() === ''}
            >
              ➕ הוסף שחקן
            </button>
          </div>
        </fieldset>

        {/* --- 4. Submit Button --- */}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition duration-200 shadow-md"
        >
          צור חדר והתחל! 🚀
        </button>
      </form>
    </div>
  );
};

export default RoomCreationForm;
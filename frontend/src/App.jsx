import RoomCreationForm from './components/RoomCreationForm';
import useDarkMode from './hooks/goDark';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const handleRoomSubmit = (roomData) => {
    console.log("Room Data Ready to be Sent:", roomData);
    
    alert('Room Data ready! Check the console.');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300 rtl">
      <div className="flex justify-start mb-6 w-full max-w-xl mx-auto">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white-200 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300"
          aria-label={isDarkMode ? 'להדליק את האור?' : 'לכבות את האור?'}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
      <RoomCreationForm onSubmit={handleRoomSubmit} />
    </div>
  )
}

export default App

import './App.css'
import RoomCreationForm from './components/RoomCreationForm';

function App() {
  const handleRoomSubmit = (roomData) => {
    console.log("Room Data Ready to be Sent:", roomData);
    // Here you would typically send this data to your backend API
    alert('Room Data ready! Check the console.');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <RoomCreationForm onSubmit={handleRoomSubmit} />
    </div>
  )
}

export default App

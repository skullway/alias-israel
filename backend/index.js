const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3001;

// In-memory store for active game rooms
// We'll store rooms by their code for easy lookup
const activeRooms = new Map();

/**
 * Generates a random, human-readable room code.
 * @param {number} length - The desired length of the code (default: 5)
 * @returns {string} - The generated room code (e.g., "A9B2U")
 */
function generateRoomCode(length = 5) {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // Removed O and 0 for clarity
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
// --- END: NEW ---

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(express.json());

// Simple test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the Hebrew Room Backend!' });
});

// Serve the compressed full dictionary file
app.get('/api/hebrew-trie', (req, res) => {
    // ... (your existing code is fine)
    const filePath = path.join(__dirname, 'node_modules', '@cspell', 'dict-he', 'he.trie.gz');
    res.sendFile(filePath, /* ... */);
});

// Serve the compressed nouns file
app.get('/api/nouns-list', (req, res) => {
    // ... (your existing code is fine)
    const filePath = path.join(__dirname, 'data', 'nouns_hebrew.json.gz');
    res.sendFile(filePath, /* ... */);
});


// Room Creation Endpoint
app.post('/api/rooms', (req, res) => {
    const roomConfig = req.body; // Data from the frontend form
    console.log('Received Room Config:', roomConfig);

    // 1. Generate a unique room code
    let roomCode;
    do {
        roomCode = generateRoomCode();
    } while (activeRooms.has(roomCode)); // Ensure code is unique

    // 2. Create the full room object
    const newRoom = {
        ...roomConfig,     // Spread the data from the form (name, wordSource, players, etc.)
        code: roomCode,    // Add the new unique code
        id: roomCode,      // Use the code as the ID
        createdAt: new Date(),
    };

    // 3. Store the new room in memory
    activeRooms.set(roomCode, newRoom);

    console.log(`Room created with code: ${roomCode}`, newRoom);

    // 4. Send the complete room object back to the creator
    res.status(201).json(newRoom);
});
// --- END: MODIFIED ---

// TODO: Add a '/api/rooms/join' endpoint here later

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
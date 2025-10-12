const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3001; // Use a port different from Vite (usually 5173)

// Middleware
app.use(cors({
    // Allow requests from your local Vite dev server
    origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(express.json()); // To parse JSON request bodies

// Simple test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the Hebrew Room Backend!' });
});

// Serve the compressed dictionary file
app.get('/api/hebrew-trie', (req, res) => {
    const filePath = path.join(__dirname, 'node_modules', '@cspell', 'dict-he', 'he.trie.gz');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Failed to send file');
        }
    });
});

// Room Creation Endpoint (This is where you'd receive the object)
app.post('/api/rooms', (req, res) => {
    const roomData = req.body;
    console.log('Received Room Data:', roomData);
    // TODO: Validate, save to DB, and broadcast the new room
    res.status(201).json({ 
        id: Date.now(), 
        status: 'Room Created', 
        name: roomData.name 
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
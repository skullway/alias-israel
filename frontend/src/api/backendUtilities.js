const API_BASE_URL = '/api'; // Uses the Vite proxy in development

export const fetchVocabularies = async () => {
    const url = `${API_BASE_URL}/vocabularies`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            // Throw an error with the status code for better debugging
            throw new Error(`Failed to fetch vocabularies: ${response.status}`);
        }
        
        return response.json();
    } catch (error) {
        console.error("API Call Error:", error);
        // Re-throw the error so the calling component can handle it
        throw error; 
    }
};

export const createRoom = async (roomData) => {
    const url = `${API_BASE_URL}/rooms`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
    });
    
    if (!response.ok) {
        throw new Error(`Failed to create room: ${response.status}`);
    }
    
    return response.json();
};
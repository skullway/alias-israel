import pako from 'pako';
import * as TrieLib from 'cspell-trie-lib';

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

export const fetchAndDecompressTrie = async (url) => {
  // 1. Fetch the compressed file as a binary ArrayBuffer
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const compressedData = await response.arrayBuffer();

  // 2. Decompress the data
  // pako.ungzip returns a Uint8Array
  const decompressedData = pako.ungzip(new Uint8Array(compressedData));

  // 3. Convert the Uint8Array to a string (the trie content)
  // Note: The trie content is typically a binary-like format,
  // but for loading into a browser-compatible cspell trie, you might need a specific CSpell utility.
  // For now, let's keep it as Uint8Array/Buffer, which is often what CSpell utilities expect.

    // Convert to string (if it's text-based)
    // const trieString = new TextDecoder('utf-8').decode(decompressedData);
    // Try the original static method first (as a property of the object)
    if (TrieLib.Trie && TrieLib.Trie.deserialize) {
        wordTrie = TrieLib.Trie.deserialize(decompressedData); 
    } 
    // If that fails, try the standalone named function
    else if (TrieLib.deserializeTrie) {
        wordTrie = TrieLib.deserializeTrie(decompressedData); 
    } 
    // Fallback: Check if the 'default' export is actually the library object
    else if (TrieLib.default && TrieLib.default.Trie && TrieLib.default.Trie.deserialize) {
        wordTrie = TrieLib.default.Trie.deserialize(decompressedData);
    }
    else {
        throw new Error("Could not find a working 'deserialize' function in cspell-trie-lib.");
    }
    // // Parse JSON (if applicable)
    // const trieData = JSON.parse(trieString);
    

  return wordTrie;
}
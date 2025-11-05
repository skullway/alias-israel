import pako from 'pako';
import { importTrie, has } from 'cspell-trie-lib';
// import { importTrie, walkerWords } from 'cspell-trie-lib';


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

// export const fetchAndDecompressTrie = async (url) => {
//   // 1. Fetch the compressed file
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   const compressedData = await response.arrayBuffer();

//   // 2. Decompress the data
//   const decompressedData = pako.ungzip(new Uint8Array(compressedData));

//   // 3. Convert to string - the decompressed trie is actually text-based
//   const trieText = new TextDecoder('utf-8').decode(decompressedData);

//   // 4. Import the trie using cspell-trie-lib
//   // importTrie expects the text content of the .trie file
//   const trie = importTrie(trieText);

//   console.log("Trie loaded successfully!");
  
//   // Now you can use the trie for spell checking
//   return trie;
// };export const fetchAndDecompressTrie = async (url) => {
export const fetchAndDecompressTrie = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const compressedData = await response.arrayBuffer();
  const decompressedData = pako.ungzip(new Uint8Array(compressedData));
  const trieText = new TextDecoder('utf-8').decode(decompressedData);
  
  const trie = importTrie(trieText);
  
  console.log("Trie loaded successfully!");
  
  return trie;
};

export const fetchAndDecompressGzipJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const ds = new DecompressionStream('gzip');

  // נעביר את ה-body דרך ה-decompressor
  const decompressedStream = response.body.pipeThrough(ds);

  // נמיר את הזרם לטקסט
  const decompressedText = await new Response(decompressedStream).text();

  // נמיר את הטקסט ל-JSON (מערך)
  const data = JSON.parse(decompressedText);

  return data; // עכשיו זה מערך מילים בעברית
};


/**
 * Get random words from a JSON file containing an array of words.
 * @param {number} count - The number of random words to fetch.
 * @param {function} [filterFn] - Optional filter function to filter words before random selection.
 * @returns {string[]} - An array of random words.
 */
export const getRandomWordsFromJSON = (count, wordsData, filterFn) => {
    if (!Array.isArray(wordsData)) {
        throw new Error('The JSON file does not contain a valid array of words.');
    }

    let words = wordsData;

    // Apply filter function if provided
    if (filterFn) {
        words = words.filter(filterFn);
    }

    // Shuffle the array and select the first `count` words
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Custom word iterator for cspell trie structure
function* iterateWords(node, prefix = '', depth = 0) {
  if (!node) return;
  
  // Check if this node marks the end of a word (k property = true)
  if (node.k === true) {
    yield prefix;
  }
  
  // If node has children (c property), recursively iterate
  if (node.c && typeof node.c === 'object') {
    for (const [char, childNode] of Object.entries(node.c)) {
      yield* iterateWords(childNode, prefix + char, depth + 1);
    }
  } else if (depth === 0) {
    // At root level, iterate directly over the node
    for (const [char, childNode] of Object.entries(node)) {
      yield* iterateWords(childNode, char, depth + 1);
    }
  }
}

// Check if a word exists in the dictionary
export const trieHasWord = (trie, word) => {
  return has(trie.c, word.toLowerCase());
};

// // Get all words from the trie
// export const trieGetAllWords = (trie, maxWords = null) => {
//   const words = [];
//   let count = 0;
  
//   for (const word of iterateWords(trie.c)) {
//     words.push(word);
//     count++;
    
//     // Optional limit
//     if (maxWords && count >= maxWords) {
//       console.log(`Stopped at ${maxWords} words`);
//       break;
//     }
//   }
  
//   console.log(`Total words collected: ${words.length}`);
//   return words;
// };

// Get words by length (more efficient for games)
export const trieGetWordsByLength = (trie, minLength, maxLength, maxWords = null) => {
  const words = [];
  let count = 0;
  
  for (const word of iterateWords(trie.c)) {
    if (word.length >= minLength && word.length <= maxLength) {
      words.push(word);
      count++;
      
      if (maxWords && count >= maxWords) {
        break;
      }
    }
  }
  
  return words;
};

// Get words starting with a specific prefix
export const trieGetWordsWithPrefix = (trie, prefix, maxWords = null) => {
  const words = [];
  const lowerPrefix = prefix.toLowerCase();
  let count = 0;
  
  for (const word of iterateWords(trie.c)) {
    if (word.startsWith(lowerPrefix)) {
      words.push(word);
      count++;
      
      if (maxWords && count >= maxWords) {
        break;
      }
    }
  }
  
  return words;
};

// Get random words (useful for word games)
export const trieGetRandomWords = (trie, count = 10, minLength = 3, maxLength = 7) => {
  const words = [];
  
  // Collect words matching the length criteria (with a reasonable limit)
  let collected = 0;
  const maxCollect = count * 1000000; // Collect 50x the needed amount for good randomness
  
  for (const word of iterateWords(trie.c)) {
    if (word.length >= minLength && word.length <= maxLength) {
      words.push(word);
      collected++;
      
      if (collected >= maxCollect) {
        break;
      }
    }
  }
  
  // Shuffle using Fisher-Yates algorithm
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  
  // Return requested number of words
  return words.slice(0, Math.min(count, words.length));
};

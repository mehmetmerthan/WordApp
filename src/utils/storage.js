import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys for AsyncStorage
export const STORAGE_KEYS = {
  KNOWN_WORDS: "knownWords",
  TO_LEARN_WORDS: "toLearnWords",
  PROCESSING_WORDS: "processingWords",
  SELECTED_LANGUAGE_TWO: "selectedLanguageTwo",
  SELECTED_LANGUAGE_THREE: "selectedLanguageThree",
  SELECTED_LANGUAGE_NAME: "selectedLanguageName",
};

// Language code mappings
export const languageList = {
  "zh-CN": "Chinese",
  hi: "Hindi",
  es: "Spanish",
  pt: "Portuguese",
  id: "Indonesian",
  ja: "Japanese",
  bn: "Bengali",
  ru: "Russian",
  de: "German",
  fr: "French",
  it: "Italian",
  ar: "Arabic",
  ko: "Korean",
  vi: "Vietnamese",
  tr: "Turkish",
};

export const langCodeMapThree = {
  Chinese: "chi",
  Hindi: "hin",
  Spanish: "spa",
  Portuguese: "por",
  Indonesian: "ind",
  Japanese: "jpn",
  Bengali: "ben",
  Russian: "rus",
  German: "ger",
  French: "fre",
  Italian: "ita",
  Arabic: "ara",
  Korean: "kor",
  Vietnamese: "vie",
  Turkish: "tur",
};

export const getSelectedLanguageTwo = async () => {
  try {
    const langCode = await AsyncStorage.getItem(
      STORAGE_KEYS.SELECTED_LANGUAGE_TWO
    );
    return langCode;
  } catch (error) {
    console.error("Error getting selected language code:", error);
    return null;
  }
};

export const getSelectedLanguageThree = async () => {
  try {
    const langCode = await AsyncStorage.getItem(
      STORAGE_KEYS.SELECTED_LANGUAGE_THREE
    );
    return langCode;
  } catch (error) {
    console.error("Error getting selected language code:", error);
    return null;
  }
};

export const getSelectedLanguageName = async () => {
  try {
    const langName = await AsyncStorage.getItem(
      STORAGE_KEYS.SELECTED_LANGUAGE_NAME
    );
    return langName;
  } catch (error) {
    console.error("Error getting selected language name:", error);
    return null;
  }
};

export const saveLanguageSelection = async (twoLetterCode, languageName) => {
  try {
    const threeLetterCode = langCodeMapThree[languageName];
    await AsyncStorage.setItem(
      STORAGE_KEYS.SELECTED_LANGUAGE_TWO,
      twoLetterCode
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.SELECTED_LANGUAGE_THREE,
      threeLetterCode
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.SELECTED_LANGUAGE_NAME,
      languageName
    );
    return true;
  } catch (error) {
    console.error("Error saving language selection:", error);
    return false;
  }
};

/**
 * Get known words from storage
 * @returns {Promise<Array>} Array of known words
 */
export const getKnownWords = async () => {
  try {
    const words = await AsyncStorage.getItem(STORAGE_KEYS.KNOWN_WORDS);
    return words ? JSON.parse(words) : [];
  } catch (error) {
    console.error("Error getting known words:", error);
    return [];
  }
};

/**
 * Get to-learn words from storage
 * @returns {Promise<Array>} Array of to-learn words
 */
export const getToLearnWords = async () => {
  try {
    const words = await AsyncStorage.getItem(STORAGE_KEYS.TO_LEARN_WORDS);
    return words ? JSON.parse(words) : [];
  } catch (error) {
    console.error("Error getting to-learn words:", error);
    return [];
  }
};

/**
 * Get processing words from storage
 * @returns {Promise<Array>} Array of processing words
 */
export const getProcessingWords = async () => {
  try {
    const words = await AsyncStorage.getItem(STORAGE_KEYS.PROCESSING_WORDS);
    return words ? JSON.parse(words) : [];
  } catch (error) {
    console.error("Error getting processing words:", error);
    return [];
  }
};

/**
 * Get all processed words (known, to-learn, processing)
 * @returns {Promise<Array>} Array of all processed words
 */
export const getAllProcessedWords = async () => {
  try {
    // Get each type of word individually to avoid Promise.all issues
    const knownWords = await getKnownWords();
    const toLearnWords = await getToLearnWords();
    const processingWords = await getProcessingWords();

    // Make sure each result is an array before combining
    const knownArray = Array.isArray(knownWords) ? knownWords : [];
    const toLearnArray = Array.isArray(toLearnWords) ? toLearnWords : [];
    const processingArray = Array.isArray(processingWords)
      ? processingWords
      : [];

    // Combine all arrays
    return [...knownArray, ...toLearnArray, ...processingArray];
  } catch (error) {
    console.error("Error getting all processed words:", error);
    return [];
  }
};

/**
 * Save known words to storage
 * @param {Array} words Array of words to save
 * @returns {Promise<void>}
 */
export const saveKnownWords = async (words) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.KNOWN_WORDS, JSON.stringify(words));
  } catch (error) {
    console.error("Error saving known words:", error);
  }
};

/**
 * Save to-learn words to storage
 * @param {Array} words Array of words to save
 * @returns {Promise<void>}
 */
export const saveToLearnWords = async (words) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.TO_LEARN_WORDS,
      JSON.stringify(words)
    );
  } catch (error) {
    console.error("Error saving to-learn words:", error);
  }
};

/**
 * Save processing words to storage
 * @param {Array} words Array of words to save
 * @returns {Promise<void>}
 */
export const saveProcessingWords = async (words) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PROCESSING_WORDS,
      JSON.stringify(words)
    );
  } catch (error) {
    console.error("Error saving processing words:", error);
  }
};

/**
 * Add a word to known words
 * @param {Object} word Word to add
 * @returns {Promise<void>}
 */
export const addKnownWord = async (word) => {
  try {
    const knownWords = await getKnownWords();
    await saveKnownWords([...knownWords, word]);
  } catch (error) {
    console.error("Error adding known word:", error);
  }
};

/**
 * Add a word to to-learn words
 * @param {Object} word Word to add
 * @returns {Promise<void>}
 */
export const addToLearnWord = async (word) => {
  try {
    const toLearnWords = await getToLearnWords();
    await saveToLearnWords([...toLearnWords, word]);
  } catch (error) {
    console.error("Error adding to-learn word:", error);
  }
};

/**
 * Move a word from to-learn to processing
 * @param {Object} word Word to move
 * @returns {Promise<{toLearn: Array, processing: Array}>} Updated arrays
 */
export const moveToProcessing = async (word) => {
  try {
    // Get current words
    const toLearnWords = await getToLearnWords();
    const processingWords = await getProcessingWords();

    // Remove from to-learn
    const updatedToLearn = toLearnWords.filter((w) => w.term !== word.term);

    // Add to processing
    const updatedProcessing = [...processingWords, word];

    // Save both arrays
    await saveToLearnWords(updatedToLearn);
    await saveProcessingWords(updatedProcessing);

    return {
      toLearn: updatedToLearn,
      processing: updatedProcessing,
    };
  } catch (error) {
    console.error("Error moving word to processing:", error);
    throw error;
  }
};

/**
 * Delete a word from processing
 * @param {Object} word Word to delete
 * @returns {Promise<Array>} Updated processing words array
 */
export const deleteFromProcessing = async (word) => {
  try {
    const processingWords = await getProcessingWords();
    const updatedProcessing = processingWords.filter(
      (w) => w.term !== word.term
    );
    await saveProcessingWords(updatedProcessing);
    return updatedProcessing;
  } catch (error) {
    console.error("Error deleting word from processing:", error);
    throw error;
  }
};

/**
 * Clear all data from storage (preserves language selection if keepLanguage is true)
 * @param {boolean} keepLanguage Whether to keep the language selection
 * @returns {Promise<void>}
 */
export const clearAllData = async (keepLanguage = false) => {
  try {
    // Store language codes if needed
    let langCodeTwo = null;
    let langCodeThree = null;
    let langName = null;

    if (keepLanguage) {
      langCodeTwo = await getSelectedLanguageTwo();
      langCodeThree = await getSelectedLanguageThree();
      langName = await getSelectedLanguageName();
    }

    // Clear all data
    const keys = [
      STORAGE_KEYS.KNOWN_WORDS,
      STORAGE_KEYS.TO_LEARN_WORDS,
      STORAGE_KEYS.PROCESSING_WORDS,
    ];

    if (!keepLanguage) {
      keys.push(
        STORAGE_KEYS.SELECTED_LANGUAGE_TWO,
        STORAGE_KEYS.SELECTED_LANGUAGE_THREE,
        STORAGE_KEYS.SELECTED_LANGUAGE_NAME
      );
    }

    await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));

    // Restore language selection if needed
    if (keepLanguage && langCodeTwo && langCodeThree && langName) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_LANGUAGE_TWO,
        langCodeTwo
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_LANGUAGE_THREE,
        langCodeThree
      );
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE_NAME, langName);
    }
  } catch (error) {
    console.error("Error clearing all data:", error);
    throw error;
  }
};

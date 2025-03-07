import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Components
import WordCard from "../components/WordCard";
import LevelSelector from "../components/LevelSelector";

// Utilities
import * as StorageUtils from "../utils/storage";

function WordsScreen() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [level, setLevel] = useState("a1");
  const levels = ["a1", "a2", "b1", "b2", "c1"];
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  // Load words from API
  const loadWords = async () => {
    setLoading(true);
    try {
      // Get all processed words
      const processedWords = await StorageUtils.getAllProcessedWords();

      // Fetch words from API
      const response = await fetch(
        `https://raw.githubusercontent.com/mehmetmerthan/polingo-words/main/word-list/tr/tr-${level}.json`
      );
      const data = await response.json();

      // Filter out already processed words
      const filteredWords = data.filter(
        (word) => !processedWords.some((pw) => pw.term === word.term)
      );

      setWords(filteredWords);
      setCurrentWordIndex(0);
    } catch (error) {
      console.error("Error loading words:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWords();
    setRefreshing(false);
  }, [level]);

  // Change level
  const changeLevel = (direction) => {
    let newIndex = currentLevelIndex;

    if (direction === "next" && currentLevelIndex < levels.length - 1) {
      newIndex = currentLevelIndex + 1;
    } else if (direction === "prev" && currentLevelIndex > 0) {
      newIndex = currentLevelIndex - 1;
    }

    setCurrentLevelIndex(newIndex);
    setLevel(levels[newIndex]);
  };

  // Handle word actions
  const handleWordAction = async (action) => {
    if (words.length === 0 || currentWordIndex >= words.length) return;

    const currentWord = words[currentWordIndex];
    currentWord.level = level;

    try {
      if (action === "known") {
        // Add to known words
        await StorageUtils.addKnownWord(currentWord);
      } else if (action === "toLearn") {
        // Add to words to learn
        await StorageUtils.addToLearnWord(currentWord);
      }

      // Move to next word
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        // If no more words, reload the list
        loadWords();
      }
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };

  // Load words on mount and when level changes
  useEffect(() => {
    loadWords();
  }, [level]);

  // Get current word or status
  const getCurrentWord = () => {
    if (words.length === 0) {
      return null;
    }

    if (currentWordIndex >= words.length) {
      return null;
    }

    return words[currentWordIndex];
  };

  return (
    <SafeAreaView style={styles.container}>
      <LevelSelector level={level} onChangeLevel={changeLevel} />

      <Text style={styles.counter}>
        {words.length > 0
          ? `${currentWordIndex + 1}/${words.length} words left`
          : "0/0 words left"}
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#646cff"]}
          />
        }
      >
        <View style={styles.cardContainer}>
          <WordCard
            word={getCurrentWord()}
            loading={loading && !refreshing}
            isEmpty={words.length === 0}
            isComplete={currentWordIndex >= words.length && words.length > 0}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.tickButton]}
          onPress={() => handleWordAction("known")}
          disabled={words.length === 0 || currentWordIndex >= words.length}
        >
          <Ionicons name="checkmark" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.crossButton]}
          onPress={() => handleWordAction("toLearn")}
          disabled={words.length === 0 || currentWordIndex >= words.length}
        >
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  counter: {
    textAlign: "center",
    margin: 10,
    fontSize: 16,
    color: "#666",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tickButton: {
    backgroundColor: "#4CAF50",
  },
  crossButton: {
    backgroundColor: "#F44336",
  },
});

export default WordsScreen;

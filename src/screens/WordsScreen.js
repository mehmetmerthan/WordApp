import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import WordCard from "../components/WordCard";
import LevelSelector from "../components/LevelSelector";
import * as StorageUtils from "../utils/storage";

function WordsScreen({ navigation }) {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [level, setLevel] = useState("a1");
  const [languageCode, setLanguageCode] = useState(null);
  const [languageName, setLanguageName] = useState(null);
  const levels = ["a1", "a2", "b1", "b2", "c1"];
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const checkLanguage = async () => {
        const langCode = await StorageUtils.getSelectedLanguageTwo();
        const langName = await StorageUtils.getSelectedLanguageName();

        setLanguageCode(langCode);
        setLanguageName(langName);

        if (!langCode) {
          setLoading(false);
        } else {
          loadWords();
        }
      };

      checkLanguage();
    }, [])
  );

  const loadWords = async () => {
    if (!languageCode) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const processedWords = await StorageUtils.getAllProcessedWords();
      const response = await fetch(
        `https://raw.githubusercontent.com/mehmetmerthan/polingo-words/main/word-list/${languageCode}/${languageCode}-${level}.json`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch words. Status: ${response.status}`);
      }
      const data = await response.json();
      const filteredWords = data.filter(
        (word) => !processedWords.some((pw) => pw.term === word.term)
      );

      setWords(filteredWords);
      setCurrentWordIndex(0);
    } catch (error) {
      console.error("Error loading words:", error);
      if (error.message.includes("Failed to fetch")) {
        Alert.alert(
          "Error",
          `Could not load words for ${languageName} (${languageCode}) at level ${level.toUpperCase()}. Please try another language or level.`
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWords();
    setRefreshing(false);
  }, [level, languageCode]);

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

  const handleWordAction = async (action) => {
    if (words.length === 0 || currentWordIndex >= words.length) return;

    const currentWord = words[currentWordIndex];
    currentWord.level = level;

    try {
      if (action === "known") {
        await StorageUtils.addKnownWord(currentWord);
      } else if (action === "toLearn") {
        await StorageUtils.addToLearnWord(currentWord);
      }

      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        loadWords();
      }
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };

  useEffect(() => {
    if (languageCode) {
      loadWords();
    }
  }, [level, languageCode]);

  const getCurrentWord = () => {
    if (words.length === 0) {
      return null;
    }

    if (currentWordIndex >= words.length) {
      return null;
    }

    return words[currentWordIndex];
  };

  const goToSettings = () => {
    navigation.navigate("Settings");
  };

  const renderNoLanguageMessage = () => (
    <View style={styles.noLanguageContainer}>
      <Ionicons name="language-outline" size={60} color="#aaa" />
      <Text style={styles.noLanguageText}>
        Please select a language from the settings.
      </Text>
      <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
        <Text style={styles.settingsButtonText}>Go to Settings</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {languageCode ? (
        <>
          <LevelSelector level={level} onChangeLevel={changeLevel} />
          <Text style={styles.title}>Oxford's 5000 Words</Text>
          <Text style={styles.counter}>
            {words.length > 0
              ? `${currentWordIndex + 1}/${
                  words.length
                } words left • ${languageName}`
              : `0/0 words left • ${languageName}`}
          </Text>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#007AFF"]}
              />
            }
          >
            <View style={styles.cardContainer}>
              <WordCard
                word={getCurrentWord()}
                loading={loading && !refreshing}
                isEmpty={words.length === 0}
                isComplete={
                  currentWordIndex >= words.length && words.length > 0
                }
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
        </>
      ) : (
        !loading && renderNoLanguageMessage()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    margin: 10,
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
  noLanguageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  noLanguageText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  settingsButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WordsScreen;

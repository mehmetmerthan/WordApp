import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

const WordCard = ({ word, loading, isEmpty, isComplete }) => {
  const [isBlurred, setIsBlurred] = useState(true);

  if (loading) {
    return <ActivityIndicator size="large" color="#646cff" />;
  }

  if (isEmpty) {
    return (
      <Text style={styles.emptyText}>
        No more words to learn at this level!
      </Text>
    );
  }

  if (isComplete) {
    return (
      <Text style={styles.emptyText}>
        You've completed all words! Change level or check your dictionary.
      </Text>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.termText}>{word.term}</Text>
      <TouchableOpacity onPress={() => setIsBlurred(!isBlurred)}>
        <Text style={[styles.meaningText, isBlurred && styles.blurredText]}>
          {isBlurred ? "******" : word.meaning}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    paddingVertical: 80,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  termText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  meaningText: {
    fontSize: 30,
    color: "#666",
  },
  blurredText: {
    color: "#666",
    letterSpacing: 5, // Optional: Space out the asterisks
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    padding: 20,
  },
});

export default WordCard;

import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const WordCard = ({ word, loading, isEmpty, isComplete }) => {
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
      <Text style={styles.meaningText}>{word.meaning}</Text>
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
    marginBottom: 10,
    color: "#333",
  },
  meaningText: {
    fontSize: 30,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    padding: 20,
  },
});

export default WordCard;

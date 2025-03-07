import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LevelSelector = ({ level, onChangeLevel }) => {
  return (
    <View style={styles.levelSelector}>
      <TouchableOpacity
        onPress={() => onChangeLevel("prev")}
        style={styles.arrowButton}
      >
        <Ionicons name="arrow-back" size={24} color="#646cff" />
      </TouchableOpacity>

      <Text style={styles.levelText}>Level: {level.toUpperCase()}</Text>

      <TouchableOpacity
        onPress={() => onChangeLevel("next")}
        style={styles.arrowButton}
      >
        <Ionicons name="arrow-forward" size={24} color="#646cff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  levelSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  arrowButton: {
    padding: 5,
  },
  levelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default LevelSelector;

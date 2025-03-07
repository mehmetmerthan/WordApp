import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";

// Utilities
import * as StorageUtils from "../utils/storage";

function SettingsScreen() {
  const clearAllData = async () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all saved words? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await StorageUtils.clearAllData();
              Alert.alert("Success", "All data has been cleared.");
            } catch (error) {
              console.error("Error clearing data:", error);
              Alert.alert("Error", "Failed to clear data.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsSection}>
        <Text style={styles.settingsHeader}>App Settings</Text>

        <View style={styles.settingsItem}>
          <Text style={styles.settingsLabel}>Clear All Data</Text>
          <Text style={styles.settingsDescription}>
            Reset all your progress by clearing all saved words.
          </Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
            <Text style={styles.clearButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  settingsSection: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  settingsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    color: "#333",
  },
  settingsItem: {
    padding: 15,
  },
  settingsLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  settingsDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: "#F44336",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SettingsScreen;

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Button,
} from "react-native";
import LanguageSelector from "../components/LanguageSelector";
import * as StorageUtils from "../utils/storage";

function SettingsScreen({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const loadLanguage = async () => {
      const langName = await StorageUtils.getSelectedLanguageName();
      setSelectedLanguage(langName);
    };

    loadLanguage();
  }, []);

  const handleLanguageSelect = async (code, name) => {
    Alert.alert(
      "Change Language",
      `Are you sure you want to change the language to ${name}? This will clear your current word progress.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Change",
          onPress: async () => {
            try {
              // Clear all data except language settings
              await StorageUtils.clearAllData(true);

              // Save new language selection
              await StorageUtils.saveLanguageSelection(code, name);

              // Update state
              setSelectedLanguage(name);

              Alert.alert(
                "Language Changed",
                `Language changed to ${name}. Your word progress has been reset.`,
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate("Words"),
                  },
                ]
              );
            } catch (error) {
              console.error("Error changing language:", error);
              Alert.alert("Error", "Failed to change language.");
            }
          },
        },
      ]
    );
  };

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
              // Keep language settings when clearing data
              await StorageUtils.clearAllData(true);
              Alert.alert("Success", "All word progress has been cleared.");
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
      <ScrollView>
        <View style={styles.settingsSection}>
          <Text style={styles.settingsHeader}>Language Settings</Text>

          <View style={styles.settingsItem}>
            <Text style={styles.settingsLabel}>Learning Language</Text>
            <Text style={styles.settingsDescription}>
              Select the language you want to learn. Changing the language will
              reset your progress.
            </Text>
            <View style={styles.selectorContainer}>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onSelectLanguage={handleLanguageSelect}
              />
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsHeader}>Data Management</Text>

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
      </ScrollView>
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
    marginBottom: 20,
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
  selectorContainer: {
    marginBottom: 10,
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

import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Alert,
  TextInput,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Icon } from "@rneui/themed";
// Components
import FilterChips from "../components/FilterChips";

// Utilities
import * as StorageUtils from "../utils/storage";

function DictionaryScreen() {
  const [toLearnWords, setToLearnWords] = useState([]);
  const [processingWords, setProcessingWords] = useState([]);
  const [activeTab, setActiveTab] = useState("toLearn"); // 'toLearn' or 'processing'
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalGlishVisible, setModalGlishVisible] = useState(false);
  const levels = ["a1", "a2", "b1", "b2", "c1"];

  // Load dictionary words
  const loadDictionary = async () => {
    setLoading(true);
    try {
      const toLearn = await StorageUtils.getToLearnWords();
      const processing = await StorageUtils.getProcessingWords();

      setToLearnWords(toLearn);
      setProcessingWords(processing);
    } catch (error) {
      console.error("Error loading dictionary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Move word from toLearn to processing
  const moveToProcessing = async (word) => {
    try {
      const result = await StorageUtils.moveToProcessing(word);
      setToLearnWords(result.toLearn);
      setProcessingWords(result.processing);
    } catch (error) {
      console.error("Error moving word to processing:", error);
    }
  };

  // Delete word from processing
  const deleteFromProcessing = async (word) => {
    try {
      Alert.alert(
        "Delete Word",
        `Are you sure you want to delete "${word.term}" permanently?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                const updatedProcessing =
                  await StorageUtils.deleteFromProcessing(word);
                setProcessingWords(updatedProcessing);
              } catch (error) {
                console.error("Error deleting word:", error);
              }
            },
            style: "destructive",
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  // Filter words based on search and level filter
  const filterWords = (words) => {
    let filtered = [...words];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(
        (word) =>
          word.term.toLowerCase().includes(searchText.toLowerCase()) ||
          word.meaning.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply level filter
    if (selectedLevelFilter) {
      filtered = filtered.filter((word) => word.level === selectedLevelFilter);
    }

    return filtered;
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDictionary();
    setRefreshing(false);
  }, []);

  // Load dictionary on mount
  useEffect(() => {
    loadDictionary();
  }, []);

  // Render dictionary item
  const renderItem = ({ item }) => (
    <View style={styles.dictionaryItem}>
      {/* Left side: Checkbox/Delete button */}
      {activeTab === "toLearn" ? (
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => moveToProcessing(item)}
        >
          <Ionicons name="square-outline" size={24} color="#646cff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteFromProcessing(item)}
        >
          <Ionicons name="trash-outline" size={24} color="#F44336" />
        </TouchableOpacity>
      )}

      {/* Middle: Word information */}
      <TouchableOpacity
        style={styles.wordInfo}
        onPress={activeTab === "toLearn" ? () => moveToProcessing(item) : null}
      >
        <Text style={styles.termText}>{item.term}</Text>
        <Text style={styles.meaningText}>{item.meaning}</Text>
        <Text style={styles.levelBadge}>Level: {item.level.toUpperCase()}</Text>
      </TouchableOpacity>

      {/* Right side: Button group */}
      <View style={styles.buttonGroup}>
        <Button
          type="clear"
          icon={
            <Icon
              name="play-circle"
              type="font-awesome"
              size={32}
              color={"#646cff"}
            />
          }
          //onPress={() => playSound(item.term)}
          disabled={loading}
        />
        <Button
          type="clear"
          icon={
            <Icon
              name="info-circle"
              type="font-awesome"
              size={32}
              color={"#646cff"}
            />
          }
          //onPress={openInfo}
        />
        <Button
          type="clear"
          icon={
            <Icon
              name="youtube-play"
              type="font-awesome"
              color={"#646cff"}
              size={32}
            />
          }
          //onPress={openGlish}
        />
      </View>
      {modalVisible && (
        <WordDetailModal
          visible={modalVisible}
          setVisible={setModalVisible}
          word={item.term}
          translateTo={langCodeThree}
        />
      )}
      {modalGlishVisible && (
        <GlishModal
          visible={modalGlishVisible}
          setVisible={setModalGlishVisible}
          word={item.term}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "toLearn" && styles.activeTab]}
          onPress={() => setActiveTab("toLearn")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "toLearn" && styles.activeTabText,
            ]}
          >
            To be Learned ({toLearnWords.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "processing" && styles.activeTab]}
          onPress={() => setActiveTab("processing")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "processing" && styles.activeTabText,
            ]}
          >
            Being Processed ({processingWords.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search words..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FilterChips
        selectedFilter={selectedLevelFilter}
        onSelectFilter={setSelectedLevelFilter}
        levels={levels}
      />

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#646cff" />
      ) : (
        <FlatList
          data={filterWords(
            activeTab === "toLearn" ? toLearnWords : processingWords
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.term}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No words in this category.</Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#646cff"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabSelector: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#646cff",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#646cff",
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "white",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  dictionaryItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#646cff",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 15,
  },
  deleteButton: {
    marginRight: 15,
  },
  wordInfo: {
    flex: 1,
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  actionButton: {
    paddingHorizontal: 8,
  },
  termText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  meaningText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  levelBadge: {
    fontSize: 12,
    color: "#888",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    padding: 20,
  },
});

export default DictionaryScreen;

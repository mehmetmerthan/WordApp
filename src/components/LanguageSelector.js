import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { languageList } from "../utils/storage";

const LanguageSelector = ({ selectedLanguage, onSelectLanguage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const languages = Object.entries(languageList).map(([code, name]) => ({
    code,
    name,
  }));

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSelectLanguage = (code, name) => {
    onSelectLanguage(code, name);
    closeModal();
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => handleSelectLanguage(item.code, item.name)}
    >
      <Text style={styles.languageName}>{item.name}</Text>
      <Text style={styles.languageCode}>{item.code}</Text>
      {selectedLanguage === item.name && (
        <Ionicons name="checkmark" size={22} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selector} onPress={openModal}>
        <Text style={styles.selectorText}>
          {selectedLanguage || "Select a language"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
  },
  selectorText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  languageName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  languageCode: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
});

export default LanguageSelector;

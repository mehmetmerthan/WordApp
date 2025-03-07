import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const FilterChips = ({ selectedFilter, onSelectFilter, levels }) => {
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Filter by level:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedFilter && styles.activeFilterChip,
          ]}
          onPress={() => onSelectFilter("")}
        >
          <Text
            style={[
              styles.filterChipText,
              !selectedFilter && styles.activeFilterChipText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {levels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterChip,
              selectedFilter === level && styles.activeFilterChip,
            ]}
            onPress={() => onSelectFilter(level)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === level && styles.activeFilterChipText,
              ]}
            >
              {level.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  filterChip: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: "#646cff",
  },
  filterChipText: {
    color: "#666",
    fontSize: 14,
  },
  activeFilterChipText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FilterChips;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';

export default function SwapButton() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const schools = ['Oxford', 'Central Board', 'Good Shepherd', 'Don Bosco'];

  const toggleSchoolSelection = (school) => {
    if (selectedSchool === school) {
      // Deselect if the same school is selected
      setSelectedSchool(null);
    } else {
      setSelectedSchool(school);
      // Close dropdown and simulate reloading or update the state as needed
      setDropdownVisible(false);
      Alert.alert('Selected School', `You selected ${school}`);
      // Add any additional logic to reload or update here
    }
  };

  return (
    <View>
      {/* Swap button */}
      <TouchableOpacity 
        style={styles.swapButton} 
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.swapText}>Swap School</Text>
      </TouchableOpacity>

      {/* Dropdown List */}
      {dropdownVisible && (
        <View style={styles.dropdownContainer}>
          <FlatList 
            data={schools}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.schoolItem}>
                <CheckBox
                  title={item}
                  checked={selectedSchool === item}
                  onPress={() => toggleSchoolSelection(item)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  checkedColor='#018CE0'
                />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  swapButton: {
    backgroundColor: '#018CE0',
    padding: 10,
    borderRadius: 20,
    width: 130,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  swapText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    margin: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
  },
  schoolItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  checkboxText: {
    fontSize: 16,
  },
});

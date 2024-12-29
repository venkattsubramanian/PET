import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, FlatList, Modal } from 'react-native';
import { CheckBox } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

const InputField = ({ 
  label, 
  placeholder, 
  secureTextEntry, 
  keyboardType, 
  imageSource, 
  hideimage, 
  unhideimage, 
  isVisible, 
  onChangeText, 
  value, 
  schoolList,       
  selectedSchools,  
  setSelectedSchools 
}) => {
  const [isTextHidden, setIsTextHidden] = useState(secureTextEntry);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // For showing dropdown modal

  const togglePasswordVisibility = () => {
    setIsTextHidden(!isTextHidden);
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Function to select/unselect school
  const toggleSchoolSelection = (school) => {
    const isAlreadySelected = selectedSchools.some(selected => selected.id === school.id);
    if (isAlreadySelected) {
      setSelectedSchools(selectedSchools.filter(item => item.id !== school.id));
    } else {
      setSelectedSchools([...selectedSchools, school]);
    }
  };

  // Function to get selected school names
  const getSelectedSchoolNames = () => {
    if (selectedSchools.length === 0) {
      return 'Select School';  // Placeholder when no school is selected
    } else if (selectedSchools.length === 1) {
      return selectedSchools[0].schoolName;  // Display only the first school name
    } else {
      return selectedSchools.map(school => school.schoolName).join(', ');  // Join names for multiple schools
    }
  };
  

  return (
    <Animatable.View 
      animation={isVisible ? 'flipInX' : 'flipInY'}
      duration={300}
      style={[styles.inputContainer, !isVisible && { height: 0, opacity: 0, marginBottom: 0 }]}
    >
      <Text style={styles.labelText}>{label}</Text>
      {label !== 'Select School' ? (
        <View style={styles.inputWrapper}>
          <Image source={imageSource} style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder={placeholder} 
            secureTextEntry={isTextHidden} 
            keyboardType={keyboardType}
            multiline={label === 'Address'}
            showsVerticalScrollIndicator={false}
            onChangeText={onChangeText}
            value={value}
          />

          {secureTextEntry && (
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Image source={isTextHidden ? hideimage : unhideimage } style={styles.hideIcon} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        // Dropdown for schools
        <View>
           <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
           <Text style={[ styles.dropdownText, 
             { color: selectedSchools.length === 0 ? 'grey' : 'black' }  // Conditional color
        ]}
          >
          {getSelectedSchoolNames()}
          </Text>
        </TouchableOpacity>

          
          {/* Dropdown modal */}
          <Modal 
            transparent={true}
            animationType="slide"
            visible={isDropdownVisible}
            onRequestClose={toggleDropdown}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select School(s)</Text>
                <FlatList 
                  data={schoolList}
                  keyExtractor={(item) => item.id.toString()} // Use id for keyExtractor
                  renderItem={({ item }) => (
                    <View style={styles.schoolItem}>
                      <CheckBox 
                        checked={selectedSchools.some(school => school.id === item.id)}
                        onPress={() => toggleSchoolSelection(item)}
                        checkedColor="#007bff"
                      />
                      <Text style={styles.schoolText}>{item.schoolName}</Text>
                    </View>
                  )}
                />

                <TouchableOpacity onPress={toggleDropdown} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </Animatable.View>
  );
};


export default InputField;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 5,
  },
  labelText: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#F3F4F6',
    paddingLeft: 10,
    marginBottom: 10,
  },
  inputIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  hideIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 15,
  },
  dropdownButton: {
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 15,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  schoolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  schoolText: {
    marginLeft: 10,
    fontSize: 16,
  },
  closeButton: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});

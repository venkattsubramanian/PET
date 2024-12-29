import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomActionSheet = ({ onClose, onSelectOption }) => {
  return (
     <View style={styles.actionSheet}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => {
            onSelectOption(option.name);
            onClose();
          }}
        >
            {option.iconSource === 'local' ? (
            <Image source={option.icon} style={styles.icon} />
          ) : (
            <Icon name={option.icon} size={30} color="#000" />
          )}
          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
      </View>
  );
};

const options = [

  { name: 'pick', label: 'Gallery', icon: require('../../../../../assets/images/chatGallery.png'), iconSource: 'local' },
  { name: 'capture', label: 'Image', icon:  require('../../../../../assets/images/chatCamera.png'), iconSource: 'local' },
  { name: 'Map', label: 'Video', icon:  require('../../../../../assets/images/chatCamera.png'), iconSource: 'local' }, 
  { name: 'pickAudio', label: 'Audio', icon:  require('../../../../../assets/images/chatAudio.png'), iconSource: 'local' }, 
  // { name: 'recordAudio', label: 'Mic', icon:  require('../../../../../assets/images/chatMic.png'), iconSource: 'local' }, 
  // { name: 'pickDoc', label: 'Doc', icon:  require('../../../../../assets/images/chatDoc.png'), iconSource: 'local' }, 
];

const styles = StyleSheet.create({
  actionSheet: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderRadius: 10,
    elevation: 5,
    left: 0,
    bottom: -20,
    padding: 15
  },
  option: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '25%', 
    margin: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
    marginTop: 10,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});

export default CustomActionSheet;

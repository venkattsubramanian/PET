import React, { useState } from 'react';
import { View, StyleSheet, Image, Modal, TouchableOpacity, Text } from 'react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Expo or react-native-vector-icons

const MessageImageView = ({ currentMessage }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  // Handle on tap
  const onTap = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      setModalVisible(true);
    }
  };

  return (
    <View>
      <TapGestureHandler onHandlerStateChange={onTap} numberOfTaps={1}>
        <View style={styles.container}>
          <Image
            source={{ uri: currentMessage.image }}
            resizeMode="contain"
            style={styles.image}
            onError={() => console.log('Error loading image')}
          />
        </View>
      </TapGestureHandler>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Close button at top-left corner */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>

          {/* Full-screen image */}
          <Image
            source={{ uri: currentMessage.image }}
            resizeMode="contain"
            style={styles.fullScreenImage}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    width: 300,
    height: 200,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1, // Ensures the button is above the image
  },
});

export default MessageImageView;

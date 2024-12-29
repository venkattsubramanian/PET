import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';

const MessageVideo = ({ currentMessage, index }) => {
  const [playStates, setPlayStates] = useState({}); // Store play states for each video
  const videoRef = useRef(null); // Reference for the Video component

  const togglePlayPause = (index) => {
    setPlayStates((prevPlayStates) => ({
      ...prevPlayStates,
      [index]: !prevPlayStates[index],
    }));
  };

  const isPlaying = playStates[index];

  const handleDoubleTap = () => {
    console.log('Video double-tapped');
    if (videoRef.current) {
      videoRef.current.presentFullscreenPlayer(); // Trigger full-screen mode
    }
  };

  // console.log('Current Message:', currentMessage);
  return (
    <GestureHandlerRootView style={styles.container}>
      <TapGestureHandler
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === 4) { // 4 corresponds to 'end' of tap gesture
            handleDoubleTap();
          }
        }}
        numberOfTaps={2}
      >
        <View style={styles.container}>
          {currentMessage.video ? (
            <Video
              ref={videoRef} // Assign the ref to the Video component
              source={{ uri: currentMessage.video }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay={isPlaying}
              isLooping
              style={styles.video}
              onError={(error) => console.log('Video Error:', error)}
              onLoadStart={() => console.log('Video is loading')}
              onLoad={() => console.log('Video loaded')}
            />
          ) : (
            <Text>No video available</Text>
          )}
          <TouchableOpacity style={styles.playPauseButton} onPress={() => togglePlayPause(index)}>
            <Ionicons 
              name={isPlaying ? 'pause' : 'play'} 
              size={30} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </TapGestureHandler>
    </GestureHandlerRootView>
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
  video: {
    width: '100%',
    height: '100%',
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -15 }],
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 50,
  },
});

export default MessageVideo;

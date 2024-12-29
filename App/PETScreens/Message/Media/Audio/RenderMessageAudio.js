import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import AudioWaveform from './AudioWaveform';
import { setCurrentSound, stopCurrentSound } from './AudioManager';

// Helper function to convert milliseconds to mm:ss format
const formatTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export default function AudioMessage({ currentMessage }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const updatePlaybackStatus = async () => {
      if (sound) {
        const status = await sound.getStatusAsync();
        setPosition(status.positionMillis || 0);
        setIsPlaying(status.isPlaying);
        setDuration(status.durationMillis || 1);
      }
    };

    const interval = setInterval(updatePlaybackStatus, 100);

    return () => clearInterval(interval);
  }, [sound]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [sound]);

  async function playSound() {
    if (!sound) {
      await stopCurrentSound();
      
      if (currentMessage.audio) {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: currentMessage.audio });
        setSound(newSound);
        setCurrentSound(newSound);
        await newSound.playAsync();

        newSound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setSound(null);
            setCurrentSound(null);
          }
        });
      } else {
        console.error('Invalid audio URI');
      }
    } else {
      // Resume the audio if it's paused
      await sound.playAsync();
    }
  }

  async function pauseSound() {
    if (sound) {
      await sound.pauseAsync();
    }
  }

  async function handlePlayPause() {
    if (isPlaying) {
      await pauseSound();
      setIsPlaying(false);
    } else {
      await playSound();
    }
  }

  async function handleSlide(value) {
    if (sound && duration > 0) {
      await sound.setPositionAsync(value);
      setPosition(value); // Sync the slider position
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePlayPause} style={styles.button}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
      </TouchableOpacity>

      <AudioWaveform 
        duration={duration || 1}
        onSlide={handleSlide}
        progress={position || 0}
      />
            <Text style={styles.timeText}>{formatTime(position)} / {formatTime(duration)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'grey',
    borderRadius: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    marginHorizontal: 2,
  },
});

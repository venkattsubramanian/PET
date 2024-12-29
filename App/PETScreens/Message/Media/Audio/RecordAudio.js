import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioComponent = ({ onRecordFinished }) => {
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    try {
      const path = Platform.select({
        ios: 'hello.m4a',
        android: `${Dirs.CacheDir}/hello.mp3`,
      });
      setRecording(true);
      await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Recording:', e);
        return;
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      console.log('Recording stopped:', result);
      audioRecorderPlayer.removeRecordBackListener();
      // Pass the recorded file path to the parent component
      if (onRecordFinished) {
        onRecordFinished(result);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.recordButton, { backgroundColor: recording ? 'red' : '#0084ff' }]}
        onPressIn={startRecording}
        onPressOut={stopRecording}
      >
        <Ionicons name="mic" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  recordButton: {
    borderRadius: 40,
    padding: 3,
    width: 33,
    top: 5
  },
});

export default AudioComponent;

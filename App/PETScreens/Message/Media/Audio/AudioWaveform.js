import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path, Rect } from 'react-native-svg';
import Slider from '@react-native-community/slider';

export default function AudioWaveform({ duration, onSlide, progress }) {
  // Static waveform data
  const waveform = Array(100).fill(0).map(() => Math.random());

  // Generate the path data for the waveform
  const pathData = waveform.map((value, index) => {
    const x = index * (200 / waveform.length);
    const y = (1 - value) * 50;
    return `${index === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  // Ensure duration is greater than zero
  const validDuration = duration > 0 ? duration : 1; // Prevent division by zero

  return (
    <View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={validDuration}
        value={progress}
        onValueChange={value => onSlide(value)}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        thumbTintColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    marginBottom: 10,
  },
  slider: {
    width: 200,
    height: 40,
  },
});

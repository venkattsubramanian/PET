import { Platform, PermissionsAndroid } from 'react-native';
import { audioRecorderPlayer } from '../../ChatScreen/ChatScreen';

export const startRecordingAudio = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'App needs access to your microphone to record audio.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Microphone permission denied');
      return null;
    }
  }

  try {
    // Start recording (no need to specify path)
    const path = await audioRecorderPlayer.startRecorder();
    console.log('Recording started at path:', path);
    return path;
  } catch (error) {
    console.error('Error starting recorder:', error);
    return null;
  }
};
export const stopRecordingAudio = async () => {
  try {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    console.log('Recording stopped, file saved at:', result);
    return result; // This is the final file path
  } catch (error) {
    console.error('Error stopping audio recording:', error);
    return null;
  }
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GiftedChat, InputToolbar, Send, Composer, Bubble } from 'react-native-gifted-chat';
import { StyleSheet, View, Platform, PermissionsAndroid, Alert, TextInput, Button, Keyboard, ActivityIndicator, Text, KeyboardAvoidingView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, Timestamp, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, storagePath } from 'firebase/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackView from '../../../Header/BackView';
import MessageVideo from '../Media/Video/RenderMessageVideo'; 
import MessageImageView from '../Media/Image/RenderMessageImage';
import AudioMessage from '../Media/Audio/RenderMessageAudio';
import CustomMessage from '../Media/Text/renderMessageText';
import CustomActionSheet from '../Media/ActionSheet/CustomActionSheet';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { v4 as uuidv4 } from 'uuid';
import uuid from 'react-native-uuid';
import { startRecordingAudio, stopRecordingAudio } from '../Media/Audio/startRecordingAudio';
import { Ionicons } from '@expo/vector-icons';


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpsN7miRhYs-bMfsSoSlueu5omHU8NdNU",
  authDomain: "petapp-58b6d.firebaseapp.com",
  projectId: "petapp-58b6d",
  storageBucket: "petapp-58b6d.appspot.com",
  messagingSenderId: "328563172702",
  appId: "1:328563172702:web:1bbc083a0b0bff4f5b9bcf"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const userId = '2'; // Replace this with the correct user ID
const chatsRef = collection(db, 'ChatMessages', userId, 'messages');



export const audioRecorderPlayer = new AudioRecorderPlayer();

export default function Conversation() {
  const userId = '2'; // Hardcoded user ID
  const [user, setUser] = useState({ _id: '2', name: 'Surya' });
  const [messages, setMessages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        const audioPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
  
        return (
          cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
          audioPermission === PermissionsAndroid.RESULTS.GRANTED &&
          storagePermission === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else if (Platform.OS === 'ios') {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
  
      return (
        cameraPermission.status === 'granted' &&
        mediaLibraryPermission.status === 'granted'
      );
    }
    return false;
  };
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  useEffect(() => {
    const messagesRef = collection(db, 'ChatMessages', userId, 'messages');
    
    const unsubscribe = onSnapshot(messagesRef, async (querySnapshot) => {
      const messagesFirestore = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const message = doc.data();
  
          // Check if it's an unwanted message
          if (!message.text && !message.fileUrl) {
            // Delete the message if it's empty or invalid
            await deleteDoc(doc.ref);
            return null; // Skip this message
          }
  
          return {
            _id: doc.id,
            text: message.text || '',
            createdAt: message.createdAt ? message.createdAt.toDate() : new Date(),
            user: { _id: message.user._id },
            image: message.fileType === 'image' ? message.fileUrl : null,
            video: message.fileType === 'video' ? message.fileUrl : null,
            audio: message.fileType === 'audio' ? message.fileUrl : null,
            isUser: message.user._id === userId,
          };
        })
      );
  
      // Remove null values (deleted or unwanted messages)
      const filteredMessages = messagesFirestore.filter((message) => message !== null);
  
      // Sort messages in ascending order by createdAt (A to Z)
      filteredMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
      setMessages((prevMessages) => {
        const newMessages = filteredMessages.filter(
          (message) => !prevMessages.some((prev) => prev._id === message._id)
        );
        
        
        // Scroll to bottom after setting the new messages
  
        // Scroll to bottom after setting the new messages
        const updatedMessages = GiftedChat.append(prevMessages, newMessages);
  
        if (chatRef.current && newMessages.length > 0) {
          chatRef.current.scrollToBottom();
        }
  
        return updatedMessages;
      });
    });
  
    return () => unsubscribe();
  }, [userId]);
  
   
   

  

  const appendMessages = useCallback((messages) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

  async function handleSend(newMessages = []) {
    try {
      const writes = newMessages.map(async (m) => {
        // Check if the message includes a file (audio)
        if (m.fileType && m.fileUrl) {
          // Ensure fileUrl and fileType are valid before adding
          if (m.fileUrl.trim() !== '' && m.fileType.trim() !== '') {
            return addDoc(collection(db, 'ChatMessages', userId, 'messages'), {
              _id: m._id || uuidv4(),
              user: { _id: userId },
              text: m.text || '', // Optionally empty if it's just a file
              createdAt: m.createdAt || new Date(),
              fileType: m.fileType,
              fileUrl: m.fileUrl,
              fileName: m.fileName || '', // Ensure fileName is valid
            });
          } else {
            console.error('Invalid file message: missing fileUrl or fileType');
            return null; // Skip invalid messages
          }
        } else if (m.text && m.text.trim() !== '') {
          // Handle regular text messages
          const messageData = {
            _id: m._id || uuidv4(),
            user: { _id: userId },
            text: m.text.trim(), // Ensure text isn't empty
            createdAt: m.createdAt || new Date(),
          };
  
          return addDoc(collection(db, 'ChatMessages', userId, 'messages'), messageData);
        } else {
          console.error('Invalid message: No text or file');
          return null; // Skip invalid messages
        }
      });
  
      // Filter out any null results from skipped invalid messages
      const validWrites = (await Promise.all(writes)).filter(Boolean);
  
      if (validWrites.length > 0) {
        // Scroll to bottom after sending the message
        if (chatRef.current) {
          chatRef.current.scrollToEnd({ animated: true });
        }
      }
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  }


  

  const uploadMediaToStorage = async (uri, type) => {
    try {
      console.log('Uploading file:', uri);
  
      const normalizedUri = Platform.OS === 'ios' && uri.startsWith('file://') ? uri.replace('file://', '') : uri;
  
      const blob = await fetchFileBlob(normalizedUri);
      console.log('File MIME type:', blob.type);
  
      const fileName = uri.split('/').pop();
      const storagePath = `chat/${new Date().getTime()}_${fileName}`;
      const storageRef = ref(storage, storagePath);
  
      console.log('Uploading to path:', storagePath);
  
      const snapshot = await uploadBytes(storageRef, blob);
      console.log('Upload snapshot:', snapshot);
  
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File uploaded to:', downloadURL);
  
      return { downloadURL, storagePath, fileName };
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Error', 'There was an error uploading the file. Please try again.');
      throw error;
    }
  };
  
  
  // Function to fetch file as a blob
  const fetchFileBlob = async (uri) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error fetching file:', error);
      Alert.alert('Fetch Error', 'There was an error fetching the file. Please try again.');
      throw error;
    }
  };
  


  const pickImageOrVideo = async (type) => {
    const options = {
      mediaType: 'mixed',
      quality: 0.5,
      presentationStyle: 'fullScreen',
      selectionLimit: 1,
      saveToPhotos: true,
      durationLimit: 60,
      videoQuality: 'medium',
    };
  
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
        Alert.alert('Image Picker Error', response.errorMessage);
      } else {
        const asset = response.assets[0];
        const uri = asset?.uri;
        const fileType = asset?.type?.includes('video') ? 'video' : 'image';
  
        if (!uri) {
          console.error('No URI found for the selected media.');
          return;
        }
  
        console.log('Selected media URI:', uri);
        console.log('File Type:', fileType);
  
        setLoading(true);
        try {
          const { downloadURL, storagePath } = await uploadMediaToStorage(uri, type);
          console.log('Upload successful. Download URL:', downloadURL);
          const mediaMessage = {
            _id: uuid.v4(),
            user: {
              _id: user._id,
              _senderID: user._id,
            },
            fileType,
            text: '',
            createdAt: new Date(),
            fileUrl: downloadURL,
            storagePath,
          };
          await handleSend([mediaMessage]);
        } catch (error) {
          console.error('Error uploading media:', error);
        } finally {
          setLoading(false);
        }
      }
    });
  };
  
  

  
  
  const captureImage = async () => {
    const hasPermissions = await requestPermissions();

    if (!hasPermissions) {
      Alert.alert(
        'Permission Required',
        'Please grant camera and storage permissions to use this feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    const options = {
      mediaType: 'photo', // Only capture photos
      quality: 0.5,
      presentationStyle: 'fullScreen',
      saveToPhotos: true,
    };
  
    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image capture');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
  
        if (!asset || !asset.uri) {
          console.error('No asset found or URI is missing.');
          return;
        }
  
        const uri = asset.uri;
  
        setLoading(true);
        try {
          console.log('Captured image URI:', uri);
  
          const { downloadURL, storagePath } = await uploadMediaToStorage(uri, 'image');
  
          const mediaMessage = {
            _id: uuid.v4(),
            user: {
              _id: user._id,
              _senderID: user._id,
            },
            fileType: 'image',
            text: '',
            createdAt: new Date(),
            fileUrl: downloadURL,
            storagePath,
          };
  
          await handleSend([mediaMessage]);
        } catch (error) {
          console.error("Error uploading image: ", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const captureVideo = async () => {
    const hasPermissions = await requestPermissions();

    if (!hasPermissions) {
      Alert.alert(
        'Permission Required',
        'Please grant camera and storage permissions to use this feature.',
        [{ text: 'OK' }]
      );
      return;
    }
    const options = {
      mediaType: 'video', // Only capture videos
      quality: 0.5,
      presentationStyle: 'fullScreen',
      saveToPhotos: true,
      durationLimit: 60, // Set duration limit for video
      videoQuality: 'medium',
    };
  
    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled video capture');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
  
        if (!asset || !asset.uri) {
          console.error('No asset found or URI is missing.');
          return;
        }
  
        const uri = asset.uri;
  
        setLoading(true);
        try {
          console.log('Captured video URI:', uri);
  
          const { downloadURL, storagePath } = await uploadMediaToStorage(uri, 'video');
  
          const mediaMessage = {
            _id: uuid.v4(),
            user: {
              _id: user._id,
              _senderID: user._id,
            },
            fileType: 'video',
            text: '',
            createdAt: new Date(),
            fileUrl: downloadURL,
            storagePath,
          };
  
          await handleSend([mediaMessage]);
        } catch (error) {
          console.error("Error uploading video: ", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };
  
  
  
  

  const pickAudio = async () => {
    setLoading(true);
    try {
      // Document picker to pick audio
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
  
      if (res && res[0] && res[0].uri) {
        const uri = res[0].uri;
  
        // Upload the audio file to storage and get the download URL and storage path
        const { downloadURL, storagePath } = await uploadMediaToStorage(uri, 'audio');
        
        // Ensure the URL is valid
        if (downloadURL && storagePath) {
          const audioMessage = {
            _id: uuidv4(), // Generate a unique ID for the message
            user: {
              _id: user._id,
              _senderID: user._id,
            },
            fileType: 'audio',
            text: '', // Assuming no text is associated with the audio message
            createdAt: new Date(), // Use JavaScript Date object for creation timestamp
            fileUrl: downloadURL,
            storagePath,
          };
  
          // Send the audio message using handleSend
          await handleSend([audioMessage]);
        } else {
          console.error('Upload failed: Missing downloadURL or storagePath');
        }
      } else {
        console.error('Invalid audio file selected');
      }
  
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the audio picker');
      } else {
        console.log('Audio Picker Error: ', err);
      }
    } finally {
      setLoading(false);
    }
  };
  
  


  const pickDoc = async () => {
    try {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        });
        const uri = res[0].uri;
        const fileName = res[0].name;

        const { downloadURL, storagePath } = await uploadMediaToStorage(uri, 'pdf');

        const docMessage = {
            _id: uuid.v4(),
            user: {
                _id: user._id,
                _senderID: user._id,
            },
            fileType: 'pdf',
            text: '', 
            createdAt: new Date(),
            fileUrl: downloadURL,
            fileName,
            storagePath,
        };

        await handleSend([docMessage]);
        // setMessages((previousMessages) => GiftedChat.append(previousMessages, [docMessage]));
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            console.log('User cancelled document picker');
        } else {
            console.error("DocumentPicker Error: ", err);
        }
    }
};



  const uploadDocument = async (file) => {
    const { uri, name, type } = file;
  
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const reference = storage().ref(`/documents/${name}`);
    
    try {
      const task = reference.putFile(uploadUri);
      
      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });
      
      await task;
      
      const downloadURL = await reference.getDownloadURL();
      console.log('File available at:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleDocumentSend = async (document) => {
    try {
      const downloadURL = await uploadDocument(document);
  
      const message = {
        _id: new Date().getTime(),
        text: document.name, // Optional: Use the document name as the message text
        createdAt: new Date(),
        user: {
          _id: userId,
        },
        fileType: document.type,
        fileUrl: downloadURL,
        fileName: document.name,
      };
  
      handleSend([message]); // Send the document message
    } catch (error) {
      console.error('Failed to send document:', error);
    }
  };
  
  // Wherever you handle document picking, ensure you call handleDocumentSend
  
  
  

  const renderSend = (props) => (
    <Send {...props} >
      <View style={styles.sendContainer}>
        <MaterialIcons name="send" size={24} color="blue" />
      </View>
    </Send>
  );

  // const renderInputToolbar = (props) => (
  //   <View style={styles.inputToolbarContainer}>
  //     {isEditing ? (
  //       <View style={styles.editContainer}>
  //         <TextInput
  //           style={styles.textInput}
  //           value={editText}
  //           onChangeText={setEditText}
  //           placeholder="Edit message"
  //         />
  //         <Button title="Done" onPress={handleEditMessage} />
  //         {/* <Button title="Cancel" onPress={() => { setIsEditing(false); setEditingMessageId(null); setEditText(''); }} /> */}
  //       </View>
  //     ) : (
  //       <InputToolbar {...props} containerStyle={styles.inputToolbar} />
  //     )}
  //   </View>
  // );


  const renderComposer = (props) => (
    <Composer {...props} textInputStyle={styles.textInput} />
    // {/* <AudioComponent onRecordFinished={handleRecordFinished} /> */}
  );

  const renderActions = (props) => (
    <View style={styles.accessoryView}>
      <MaterialIcons
        onPress={() => {
          Keyboard.dismiss(); // Dismiss the keyboard when opening the action sheet
          setActionSheetVisible(!isActionSheetVisible);
        }}
        name="attachment"
        size={24}
        color="#0084ff"
      />
      {isActionSheetVisible && (
        <CustomActionSheet
          onClose={() => setActionSheetVisible(false)} // Close the action sheet correctly
          onSelectOption={handleSelectOption}
        />
      )}
    </View>
  );

  const handleRecordAudio = async () => {
    const recordingPath = await startRecordingAudio();
    if (recordingPath) {
      console.log('Recording in progress...');
  
      setTimeout(async () => {
        console.log('Recording path:', recordingPath);
        const savedPath = await stopRecordingAudio();
        console.log('Recording stopped, path:', savedPath);
  
        if (savedPath) {
          await handleRecordFinished(savedPath);
        }
      }, 5000); // Stops after 5 seconds
    }
  };
  



  const handleRecordFinished = async (path) => {
    try {
      const downloadURL = await uploadMediaToStorage(path, 'audio');
  
      const audioMessage = {
        _id: uuidv4(), // Generating a unique ID for the message
        user: {
          _id: user._id,
          name: user.name,
        },
        FileType: 'audio',
        text: '', // Assuming no text is associated with the audio message
        createdAt: new Date(),
        fileUrl: downloadURL,
        storagePath: path,
      };
  
      await addDoc(collection(db, 'ChatMessage'), audioMessage);
  
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [audioMessage]));
      handleSend([audioMessage]);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };
  
  


  const renderMessageVideo = (props) => {
    const { currentMessage } = props;
    return <MessageVideo currentMessage={currentMessage} />;
  };

  const renderMessageImage = (props) => {
    const { currentMessage } = props;
    return <MessageImageView currentMessage={currentMessage} />;
  };
  
  const renderMessageAudio = (props) => {
    const { currentMessage } = props;
    return <AudioMessage currentMessage={currentMessage} />;
  };

  const renderMessageDoc = (props) => {
    const { currentMessage } = props;

    if (currentMessage.fileType === 'pdf') {
      console.log(':::::::::::::::;', currentMessage.fileType )
        return (
            <View style={styles.pdfContainer}>
                <MaterialIcons name="picture-as-pdf" size={30} color="red" />
                <Text style={styles.pdfName}>{currentMessage.fileName}</Text>
                <Button
                    title="Open PDF"
                    onPress={() => Linking.openURL(currentMessage.fileUrl)}
                />
            </View>
        );
    }

    return <Bubble {...props} />;
};

  


  const handleEditMessage = () => {
    setMessages(messages.map(message => 
      message._id === editingMessageId ? { ...message, text: editText } : message
    ));
    setIsEditing(false);
    setEditingMessageId(null);
    setEditText('');
  };

  const renderInputToolbar = (props) => (
    <KeyboardAvoidingView
  >
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.textInput}
            value={editText}
            onChangeText={setEditText}
            placeholder="Edit message"
          />
          <Button title="Done" onPress={handleEditMessage} />
        </View>
      ) : (
        <InputToolbar
        {...props}
        containerStyle={[
          styles.inputToolbar,
          // keyboardVisible && { marginBottom: -70 }  // Apply margin when keyboard is visible
        ]}
      />
      )}
    </KeyboardAvoidingView>
  );





  const handleDeleteMessage = async (messageId, storagePath) => {
    console.log(`Deleting message with ID: ${messageId} and storagePath: ${storagePath}`);
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: async () => {
            try {
              // Delete the message document from Firestore
              const messageDoc = doc(db, 'ChatMessage', messageId);
              await deleteDoc(messageDoc);


  
              // Delete the media from Firebase Storage
              if (storagePath) {
                const mediaRef = ref(storage, storagePath);
                await deleteObject(mediaRef);
                await fileRef.delete();
                console.log(`Deleted media from storage: ${storagePath}`);
              }
  
              // Optional: Remove the message from the local state
              setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageId));
            } catch (error) {
              console.error("Error deleting message: ", error);
            }
          }
        }
      ]
    );
  };
  
  

  const handleSelectOption = async (option) => {
    console.log('Selected option:', option);
    switch (option) {
      case 'pick':
        pickImageOrVideo();
        break;
      case 'capture':
        captureImage();
        break;
      case 'pickAudio':
        pickAudio();
        break;
      case 'recordAudio':
        await handleRecordAudio();  // Start recording when the user selects the recordAudio option
      break;
      case 'Map':
        await captureVideo();  // Start recording when the user selects the recordAudio option
      break;
      case 'pickDoc':
        pickDoc();
        break;
      default:
        console.log('Unknown option selected');
    }
  };

  useEffect(() => {
    // Scroll to bottom whenever messages are updated
    if (chatRef.current) {
      chatRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]); // Whenever messages update, scroll to the latest message

  const renderScrollToBottom = () => (
    <Ionicons name="ios-arrow-down" size={24} color="blue" />
  );

  return (
      <SafeAreaView style={styles.safeArea}>
        <BackView heading="Chats" />

        <View style={styles.container}>
          <GiftedChat
            ref={chatRef}
            messages={messages}
            onSend={(messages) => handleSend(messages)}
            user={{ _id: user._id }}
            renderMessageVideo={renderMessageVideo}
            renderMessageDoc={renderMessageDoc}
            renderMessageAudio={renderMessageAudio}
            renderMessageImage={renderMessageImage}
            renderSend={renderSend}
            scrollToBottom={true} // Enables auto-scroll
            renderInputToolbar={renderInputToolbar}
            renderComposer={renderComposer}
            renderActions={renderActions}
            renderScrollToBottomComponent={renderScrollToBottom}
            renderBubble={(props) => <CustomMessage {...props} />}
            renderMessage={(props) => <CustomMessage {...props} />}
            onLongPress={(context, message) => {
              const messageId = message._id;
              Alert.alert(
                'Message Options',
                '',
                [
                  {
                    text: 'Edit',
                    onPress: () => {
                      setEditingMessageId(message._id);
                      setEditText(message.text);
                      setIsEditing(true);
                    },
                  },
                  {
                    text: 'Delete',
                    onPress: () => handleDeleteMessage(messageId, storagePath),
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          />

          {/* Loader */}
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: Platform.OS === 'android' ? 0 : 0,
    marginBottom: Platform.OS === 'android' ? 0 : 10,
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999, 
    padding: 20, 
  },
  uploadingText: {
    marginTop: 10, 
    color: '#ffffff', 
    fontSize: 16,   
  },
  container: {
    flex: 1,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    padding: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 15,
    left: -10,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  actions: {
    marginHorizontal: 10,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  textInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
    marginRight: 10,
  },
  inputToolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessoryView:{
    padding: 10,
  },
  pdfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
},
pdfName: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
},
});

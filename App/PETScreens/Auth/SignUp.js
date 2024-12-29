import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { loginApi, loginDetails, signUpApi, selectSchoolData, schoolListApi, selectSchoolStatus, selectSchoolError } from '../../../Reducers/LoginReducer';
import { useNavigation } from '@react-navigation/native';
import usePushNotification from '../../Components/usePushNotification';
import InputField from './TextInput'; // Adjust the path if necessary

export default function App() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isSelected, setSelection] = useState(false);
  const [signInMode, setSignInMode] = useState(false); 
  const [signInClicked, setSignInClicked] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ConfirmPassword, setReEnterPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSchools, setSelectedSchools] = useState([]); // State for selected schools

  const loginState = useSelector(loginDetails);
  const schoolData = useSelector(selectSchoolData); // Should be an array of { id, schoolName }
  const schoolStatus = useSelector(selectSchoolStatus);
  const schoolError = useSelector(selectSchoolError);

  const {
    fcmToken,
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();
  }, []);

  const toggleSignInMode = () => {
    setSignInMode(!signInMode);
    setSignInClicked(true);
    setEmail('');        // Clear email field
    setPassword('');     // Clear password field
    setReEnterPassword(''); // Clear ConfirmPassword field (if you want to clear that too)
    setFirstName('');    // Clear FirstName (optional)
    setLastName('');     // Clear LastName (optional)
    setMobileNumber(''); // Clear MobileNumber (optional)
    setAddress('');      // Clear Address (optional)
  };
  

  const handleLogin = async () => {
    // Common validations
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
  
    if (!isSelected) {
      Alert.alert('Error', 'You must agree with the Terms & Conditions to proceed.');
      return;
    }
  
    if (!signInMode) { // Sign Up mode validations
      if (!ConfirmPassword || !firstName || !lastName || !mobileNumber || !address) {
        Alert.alert('Error', 'Please fill all the required fields.');
        return;
      }
  
      if (password !== ConfirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }
  
      // if (selectedSchools.length === 0) {
      //   Alert.alert('Error', 'Please select at least one school.');
      //   return;
      // }
    }
  
    try {
      const payload = {
        email,
        password,
        fcmToken,
        ...( !signInMode && {
          firstName,
          lastName,
          mobileNumber,
          address,
          termsAndConditionsAccepted: isSelected,
          ConfirmPassword,
          schoolIds: selectedSchools.map(school => school.id), // Extract and send selected school IDs
        }),
      };
    
      
      console.log(payload, ":::::::::::::PAYLOAD::::::::::;;");
  
      if (signInMode) {
        console.log('::::::Login:::::::', signInMode);
        dispatch(loginApi(payload)); // Call login API
      } else {
        console.log('::::::SignUp:::::::', payload);
        dispatch(signUpApi(payload)); // Call sign-up API
      }
    } catch (error) {
      console.error('Failed to get access token:', error);
      Alert.alert('Error', 'Failed to get access token. Please try again.');
    }
  };

  useEffect(() => {
    if (schoolStatus === 'idle') {
        dispatch(schoolListApi());
    }
  }, [dispatch, schoolStatus]);


  useEffect(() => {
    if (loginState.loginStatus === 'succeeded' && !loginState.loginError) {
      console.log('Login successful. Navigating to TabNavigator...');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainStack', params: { screen: 'TabNavigator' } }],
      });
    } else if (loginState.signUpStatus === 'succeeded' && !loginState.signUpError) {
      console.log('Sign-up successful. Navigating to TabNavigator...');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainStack', params: { screen: 'TabNavigator' } }],
      });
    }
  }, [loginState, navigation]);
  
  
  

  if (schoolStatus === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#018CE0" />
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >

          <View style={styles.logoContainer}>
            <Image style={styles.image} source={require('../../../assets/images/logoCover.png')} />
          </View>

          <Text style={styles.title}>{!signInMode ? 'Welcome' : 'Welcome Back'}</Text>
          <Text style={styles.subtitle}>
            {!signInMode ? 'Create an account' : 'Sign In to Your Account'}
          </Text>

      

          <KeyboardAwareScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >

            <InputField 
              label="Email" 
              placeholder="Enter email" 
              keyboardType="email-address"
              imageSource={require('../../../assets/images/Mail.png')}
              secureTextEntry={false} 
              isVisible={true} 
              onChangeText={setEmail}
              value={email}
            />

            <InputField 
              label="Password" 
              placeholder="Enter password" 
              secureTextEntry={true}
              imageSource={require('../../../assets/images/Lock.png')}
              hideimage={require('../../../assets/images/Hide.png')}
              unhideimage={require('../../../assets/images/Hide2.png')}
              isVisible={true} 
              onChangeText={setPassword}
              value={password}
            />

            {!signInMode && (
              <>
                <InputField 
                  label="ConfirmPassword" 
                  placeholder="ConfirmPassword" 
                  secureTextEntry={true}
                  imageSource={require('../../../assets/images/Lock.png')}
                  hideimage={require('../../../assets/images/Hide.png')}
                  unhideimage={require('../../../assets/images/Hide2.png')}
                  isVisible={!signInMode || !signInClicked} 
                  onChangeText={setReEnterPassword}
                  value={ConfirmPassword}
                />

                <InputField 
                  label="First Name" 
                  placeholder="Enter First Name"
                  imageSource={require('../../../assets/images/User.png')}
                  isVisible={!signInMode || !signInClicked} 
                  onChangeText={setFirstName}
                  value={firstName}
                />

                <InputField 
                  label="Last Name" 
                  placeholder="Enter Last Name"
                  imageSource={require('../../../assets/images/User.png')}
                  isVisible={!signInMode || !signInClicked} 
                  onChangeText={setLastName}
                  value={lastName}
                />

                <InputField 
                  label="Mobile Number" 
                  placeholder="Enter Mobile Number" 
                  keyboardType="phone-pad" 
                  imageSource={require('../../../assets/images/Phone.png')}
                  isVisible={!signInMode || !signInClicked} 
                  onChangeText={setMobileNumber}
                  value={mobileNumber}
                />

                <InputField 
                  label="Address" 
                  placeholder="Address"
                  imageSource={require('../../../assets/images/Map pin.png')}
                  isVisible={!signInMode || !signInClicked} 
                  onChangeText={setAddress}
                  value={address}
                />

                {/* Adding the Dropdown InputField */}
                <InputField
                  label="Select School"
                  placeholder="Select School"
                  isVisible={!signInMode || !signInClicked} 
                  schoolList={schoolData}           // Pass the school list as prop
                  selectedSchools={selectedSchools} // Pass selected schools
                  setSelectedSchools={setSelectedSchools} // Pass setter function
                />

              </>
            )}
           </KeyboardAwareScrollView>
         </KeyboardAvoidingView>

        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={isSelected}
            onPress={() => setSelection(!isSelected)}
            containerStyle={styles.checkbox}
          />

          <Text style={styles.label}>
            I agree with <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>
            {!signInMode ? 'Sign Up' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.signInText}>
          {!signInMode ? 'Already have an account?' : 'Don\'t have an account yet?'}
          <Text style={styles.link} onPress={toggleSignInMode}>
            {!signInMode ? ' Sign in' : ' Sign up'}
          </Text>
        </Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 25 : 0, 
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    // flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
    // Removed fixed height and negative margin to allow proper scrolling
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  image: {
    height: 50,
    width: 3500, // Adjusted width for better fit
    resizeMode: 'contain',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'grey',
    fontSize: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15,
    color: 'grey',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    top: -20
  },
  checkbox: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  label: {
    marginLeft: -10,
    fontSize: 14,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    top: -35,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signInText: {
    textAlign: 'center',
    fontSize: 14,
    bottom: 15
  },
});

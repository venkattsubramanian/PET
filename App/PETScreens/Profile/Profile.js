import { StyleSheet, Text, Alert, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'; 
import { profileApi } from '../../../Reducers/ProfileReducer'; // Adjust the import path

import ProfileCover from './Views/ProfileCover';
import BasicDetails from './Views/BasicDetails';
import StudentDetails from './Views/StudentDetails';
import ContactSchool from './Views/ContactSchool';
import BackView from '../../Header/BackView';

export default function Profile({ setIsAuthenticated }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.login.userId);
  const profileDetails = useSelector((state) => state.profile.profileDetails);
  const profileStatus = useSelector((state) => state.profile.profileStatus);
  const profileError = useSelector((state) => state.profile.profileError);

  console.log(':::::userId::::---->', userId);

  useEffect(() => {
    if (userId) {
      dispatch(profileApi(userId));
    }
  }, [dispatch, userId]);

  // Show alert on profile fetch failure
  useEffect(() => {
    if (profileStatus === 'failed') {
      Alert.alert("Error", profileError, [{ text: "OK" }]);
    }
  }, [profileStatus, profileError]);
  

  const navigateLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            setIsAuthenticated(false);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignUp' }],
              })
            );
          }
        }
      ],
      { cancelable: true }
    );
  };

  if (profileStatus === 'loading') {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackView heading="Profile" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ProfileCover userDetails={profileDetails} />
        <BasicDetails  />
        <StudentDetails userId={userId} />
        <ContactSchool />
        <TouchableOpacity onPress={navigateLogout}>
          <Text style={{ fontSize: 18, top: 10, padding: 10, left: 10, color: 'red' }}>
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: Platform.OS === 'android' ? 0 : -40,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 50,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

export default function ProfileCover({ userDetails }) {
  return (
    <View style={styles.container}>
      <Image style={styles.editImage} source={require('../../../../assets/images/edit.png')} />
      <Image style={styles.profileImage} source={require('../../../../assets/images/avatarP.png')} />

      <Text style={styles.name}>{userDetails?.name || 'N/A'}</Text>
      <Text style={styles.email}>{userDetails?.email || 'N/A'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 250,
    width: '95%',
    left: 10,
    top: -20,
    padding: 10,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  editImage: {
    height: 40,
    width: 40,
    right: -120,
    top: -10,
  },
  profileImage: {
    height: 120,
    width: 120,
    top: -10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    bottom: -10,
  },
  email: {
    fontSize: 18,
    bottom: -20,
    color: 'grey',
  },
});

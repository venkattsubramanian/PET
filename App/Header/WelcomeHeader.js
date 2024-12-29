import { StyleSheet, TouchableOpacity, View, Image} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function WelcomeHeader( {hideIcons} ) {
  const navigation = useNavigation();

const navigateProfile = () => {
    navigation.navigate('Profile');
};

const navigateNotification = () => {
  navigation.navigate('Notification')
}

const navigateHome = () => {
  navigation.navigate('Home')
}

const navigateScanner = () => {
  navigation.navigate('Scanner');
};


  return (
    <View style={styles.container}>   

      <View style={styles.header}>  
      <TouchableOpacity onPress={navigateHome} >
      <Image style={styles.image} source={require('../../assets/images/logoCover.png')} />
      </TouchableOpacity>

      {!hideIcons && (
          <>


        <TouchableOpacity onPress={navigateScanner} style={styles.iconContainer}>
        <Ionicons name="scan" size={28} color="#018CE0" />
        </TouchableOpacity>


      <TouchableOpacity onPress={navigateNotification} >
      <Ionicons name="notifications" size={28} color="#018CE0" style={styles.notify} />

      </TouchableOpacity>

      <TouchableOpacity onPress={navigateProfile}>
      <Image style={styles.profileImage} source={require('../../assets/images/avatarP.png')} />
      </TouchableOpacity>

      </>
        )}

      </View>
     
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        height: 70,
    },
    header:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 50,
      left: 20,
      top: 10,
    },
    image:{
      height: 50,
      width: 200,
      resizeMode: 'contain',
    },
    notify:{
      right: 30,
      top: 12,
    },
    profileImage:{
      height: 40,
      width: 40,
      right: 40,
      top: 5,
    },
    background: {
      borderRadius: 20,
      borderColor: 'black',
      height: 40,
      width: 40,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      borderRadius: 10,
      height: 40,
      width: 40,
      top: 5,
      left: -15,
    },
})
import { StyleSheet, Text, Platform, ScrollView } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeHeader from '../../Header/WelcomeHeader';
import RadioView from '../More/Views/RadioView';
import SliderView from '../More/Views/SliderView';
import AppUpdateSliderview from '../More/Views/AppUpdatesSliderview';
import SwapButton from './Views/SwapButton'; 





export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      
      <WelcomeHeader />

     <Text style={styles.heading}>Settings</Text>

     <SwapButton />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <Text style={styles.actHead}>Account activities</Text>
      <Text style={styles.descAccount}>Description for account activities</Text>

      <Text style={styles.msgNotify}>Message notification</Text>
      <Text style={styles.notify}>Notify me about...</Text>

      <RadioView />

      <Text style={styles.notify}>In-app notification</Text>

      <SliderView/>

      <Text style={styles.actHead}>App Updates</Text>

      <AppUpdateSliderview />


      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 10 : 0, 
    paddingBottom:  Platform.OS === 'android' ? 0 : -40,
  },
    container:{
        flex: 1,
        backgroundColor: 'white',
        marginTop: 10
    },
    heading:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      marginTop: 10,
      textAlign: 'center'
    },
    actHead:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      left: 20,
      marginTop: 10,
    },
    descAccount:{
      marginBottom: 10,
      left: 20,
      color: 'grey'
    },
    msgNotify:{
      fontSize: 18,
      top: 25,
      left: 20,
      fontWeight: 'bold',
      marginBottom: 25,
    },
    notify:{
      fontSize: 18,
      top: 20,
      left: 20,
      marginBottom: 30,
    },
})
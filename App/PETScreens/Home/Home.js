import { StyleSheet, Text, View, Platform } from 'react-native'
import React from 'react'
import WelcomeHeader from '../../Header/WelcomeHeader'
import NewsFeed from './Views/NewsFeed'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>

      <WelcomeHeader style={styles.header}/>
      <Text style={styles.headline}>School Updates</Text>

      <NewsFeed style={styles.feed} />

    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 10 : 0, 
    paddingBottom:  Platform.OS === 'android' ? 0 : 60,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headline:{
   fontSize: 20,
   fontWeight: 'semibold',
   left: 40,
   top: 0,
   marginBottom: 10,
  },
  header: {
    padding: 20,
  },
  feed:{
   padding: 10,
  }
});
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function BackView( { heading } ) {
    const navigation = useNavigation();
  return (
    <View style={styles.backView}>

    <TouchableOpacity onPress={() => navigation.goBack()}>
   <Image style={styles.backimage} source={require('../../assets/images/back.png')} />
   </TouchableOpacity>

   <Text style={styles.backText}>{heading}</Text>
   
   </View>

  )
}

const styles = StyleSheet.create({
    backView:{
        height: 60,
        padding: 20,
        flexDirection: 'row',
        },
        backText:{
         fontSize: 18,
         fontWeight: 'bold',
         left: 10,
         marginBottom: -10,
        },
        backimage:{
          height: 25,
          width: 25,
        },
})
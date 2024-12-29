import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';


const RadioButton = ({ text, value, checked, setChecked }) => {
    return (
      <TouchableOpacity
        style={styles.radioView}
        onPress={() => setChecked(value)}
      >
        <View style={styles.radioflex}>
        <Text style={styles.radioText}>{text}</Text>
        <Icon
          name={checked === value ? 'dot-circle-o' : 'circle-o'}
          size={20}
          color={checked === value ? '#0000FF' : '#ccc'}
        />
        </View>
      </TouchableOpacity>
    );
  };
  


export default function App() {
    const [checked, setChecked] = useState('first'); // Initial state
    return (
  
        <View style={styles.sectionView}>
  
        <RadioButton 
          text="All new messages" 
          value="first" 
          checked={checked} 
          setChecked={setChecked} 
        />
  
        <RadioButton 
          text="Mention only" 
          value="second" 
          checked={checked} 
          setChecked={setChecked} 
        />
  
        <RadioButton 
          text="Nothing" 
          value="third" 
          checked={checked} 
          setChecked={setChecked} 
        />
  
        </View>
    )
  }
  
  const styles = StyleSheet.create({
      sectionView: {
        backgroundColor: 'green',
        height: 130,
        left: 20,
        padding: 5,
        width: '90%',
        overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
        borderRadius: 5,
        borderColor: 'grey',
        backgroundColor: 'white', // Necessary for shadow to be visible on iOS
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      radioView:{
        backgroundColor: 'white',
        height: 40,
      },
      radioflex:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10, 
      }
  })
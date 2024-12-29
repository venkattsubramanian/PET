import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';


const SwitchButton = ({ text, value, switched, setSwitched }) => {

    const toggleSwitch = () => {
        setSwitched((prev) => ({
          ...prev,
          [value]: !prev[value], 
        }));
      };
    
    
    return (
        <View  style={styles.updateView}>
      <TouchableOpacity
        style={styles.switchView}
        onPress={toggleSwitch}
      >
        <Text style={styles.switchText}>{text}</Text>

        <Icon
          name={switched[value] ? 'toggle-on' : 'toggle-off'}
          size={30}
          color={switched[value] ? '#0000FF' : '#ccc'} // Blue color for switched state
        />
      </TouchableOpacity>
      <Text style={styles.SubText}>description for news and features updates</Text>
      </View>
      
    );
  };
  


export default function App() {
    const [switched, setSwitched] = useState({
        firstSwitch: false,
        secondSwitch: false,
      });

    return (
  
    <View style={styles.sectionView}>

       <SwitchButton 
        text="News & features updates" 
        value="firstSwitch" 
        switched={switched} 
        setSwitched={setSwitched} 
      />

      <SwitchButton 
        text="Promotions" 
        value="secondSwitch" 
        switched={switched} 
        setSwitched={setSwitched} 
      />

        </View>
    )
  }
  
  const styles = StyleSheet.create({
      sectionView: {
        backgroundColor: 'green',
        height: 130,
        marginBottom: 15,
        padding: 5,
        left: 20,
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
      switchView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 15,
      },
      soundText:{
        padding: 10,
        left: 5
      },
      switchText: {
        fontSize: 16,
      },
      SubText:{
        color: 'grey',
        left: 15,
        top: -5,
      }
  })
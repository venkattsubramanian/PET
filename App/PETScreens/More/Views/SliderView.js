import { StyleSheet, Text, View, Platform, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';

const SwitchButton = ({ text, value, switched, setSwitched }) => {

    const toggleSwitch = () => {
        setSwitched((prev) => ({
          ...prev,
          [value]: !prev[value], // Toggle the switch state
        }));
    };
    
    return (
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
    );
};

export default function App() {
    const [switched, setSwitched] = useState({
        firstSwitch: false,
        secondSwitch: false,
    });

    const [soundViewExpanded, setSoundViewExpanded] = useState(false);

    const toggleSoundView = () => {
        setSoundViewExpanded(!soundViewExpanded);
    };

    // Calculate height based on number of SwitchButtons
    const sectionViewHeight = soundViewExpanded ? 130 : 50;

    return (
        <View style={[styles.sectionView, { height: sectionViewHeight }]}>
            <TouchableOpacity onPress={toggleSoundView}>
                <View style={styles.soundView}>
                    <Text style={styles.soundText}>Sounds</Text>
                    <Image style={styles.rightArrow}
                     source={soundViewExpanded 
                        ? require('../../../../assets/images/down.png')
                        : require('../../../../assets/images/right.png') }
                     />
                </View>
            </TouchableOpacity>

            {soundViewExpanded && (
                <>
                    <SwitchButton 
                        text="Vibrate" 
                        value="firstSwitch" 
                        switched={switched} 
                        setSwitched={setSwitched} 
                    />

                    <SwitchButton 
                        text="Banner" 
                        value="secondSwitch" 
                        switched={switched} 
                        setSwitched={setSwitched} 
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionView: {
        backgroundColor: 'green',
        padding: 5,
        marginBottom: 10,
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
    soundView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 40
    },
    soundText:{
        padding: 10,
        left: 5,
        fontSize: 15,
    },
    rightArrow:{
        top: 4,
        height: 25,
        width: 25, 
        right: -30,
    }
});

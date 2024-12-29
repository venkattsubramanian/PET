import { StyleSheet, Text, View, Platform, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'


export default function App() {

    const [soundViewExpanded, setSoundViewExpanded] = useState(false);

    const toggleSoundView = () => {
        setSoundViewExpanded(!soundViewExpanded);
    };

    // Calculate height based on number of SwitchButtons
    const sectionViewHeight = soundViewExpanded ? 140 : 70;

    return (
        <View style={[styles.sectionView, { height: sectionViewHeight }]}>

            <TouchableOpacity onPress={toggleSoundView}>

                <View style={styles.soundView}>

                   <Image style={styles.image}source={require('../../../../assets/images/schoolSupport.png')} />

                    <Text style={styles.soundText}>Contact School</Text>

                    <Image style={styles.rightArrow}
                    source={soundViewExpanded 
                        ? require('../../../../assets/images/down.png')
                        : require('../../../../assets/images/right.png') }
                     />

                </View>

            </TouchableOpacity>

            {soundViewExpanded && (
                <>
                <Text style={{color: 'grey', padding: 5, fontSize: 16, marginTop: 15}}>1800 34569876</Text>
                <Text  style={{color: 'grey', padding: 5, fontSize: 16}}>www.CambridgeSchool.com</Text>
    
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionView: {
        backgroundColor: 'green',
        padding: 20,
        marginBottom: 10,
        left: 20,
        top: 10,
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
    soundView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20
    },
    soundText:{
        top: 6,
        left: -40,
        fontSize: 17,
    },
    image:{
        height: 30,
        width: 30,   
    },
    rightArrow:{
        top: 4,
        height: 25,
        width: 25, 
        right: -30,
    }
});

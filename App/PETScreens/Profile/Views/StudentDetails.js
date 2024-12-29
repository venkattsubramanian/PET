import { StyleSheet, Text, View, Platform, TouchableOpacity, Image, TextInput } from 'react-native'
import React, {useState} from 'react'
import * as Animatable from 'react-native-animatable';


const InputField = ({ label, placeholder, imageSource, isVisible }) => {
    
    return (
      <Animatable.View 
        animation={isVisible ? 'flipInX' : 'flipInY'}
        duration={200}
        style={[styles.inputContainer, !isVisible && { height: 0, opacity: 0, marginBottom: 0 }]}
      >
        <Text style={{fontWeight: 'bold', marginBottom: 5, marginTop: 15}}>{label}</Text>

        <View style={styles.inputWrapper}>

          <Image source={imageSource} style={styles.inputIcon} />

          <TextInput 
            style={styles.input} 
            placeholder={placeholder} 
            showsVerticalScrollIndicator={false}
          />
  
        </View>
      </Animatable.View>
    );
  };


export default function App() {

    const [soundViewExpanded, setSoundViewExpanded] = useState(false);

    const toggleSoundView = () => {
        setSoundViewExpanded(!soundViewExpanded);
    };

    // Calculate height based on number of SwitchButtons
    const sectionViewHeight = soundViewExpanded ? 220 : 70;

    return (
        <View style={[styles.sectionView, { height: sectionViewHeight }]}>

            <TouchableOpacity onPress={toggleSoundView}>

                <View style={styles.soundView}>

                   <Image style={styles.image}source={require('../../../../assets/images/StudentDetails.png')} />

                    <Text style={styles.soundText}>Student Details</Text>

                    <Image style={styles.rightArrow}
                     source={soundViewExpanded 
                        ? require('../../../../assets/images/down.png')
                        : require('../../../../assets/images/right.png') }
                     />
                </View>

            </TouchableOpacity>

            {soundViewExpanded && (
                <>

           <InputField 
            label="Student Name" 
            placeholder="John Mathewse" 
            imageSource={require('../../../../assets/images/stdName.png')}
            secureTextEntry={false} // Ensure email field is not secure
            isVisible={true} 
          />    

            <InputField 
            label="Grade" 
            placeholder="Grade XII" 
            imageSource={require('../../../../assets/images/grade.png')}
            secureTextEntry={false} // Ensure email field is not secure
            isVisible={true} 
          />  
    
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
    },
      inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#F3F4F6',
        paddingLeft: 10,
        height : 40
      },
      inputIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
      },
      input: {
        top: 5,
        marginBottom: 10,
        padding: 5,
        fontSize: 15,
        width: '80%',
      },
});

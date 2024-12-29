import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import WelcomeHeader from '../../Header/WelcomeHeader';
import SubjectList from '../Activity/SubjectList';
import { submitActivitiesApi, allActivityDetails } from '../../../Reducers/ActivityReducer'; 
import LoaderView from '../../Components/LoaderView';

export default function Activity() {
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [hoursSpent, setHoursSpent] = useState({});
  const dispatch = useDispatch();
  const { submitStatus, submitError } = useSelector(allActivityDetails); 
  const userId = useSelector((state) => state.login.userId); 
  console.log(':::::AcitivityuserId::::---->', userId)

  if (submitStatus === 'loading') {
      return (
        <View style={styles.loaderContainer}>
          <LoaderView />
        </View>
      );
  }

  const handleSubmit = () => {

    console.log('Updated selectedSubjects:', selectedSubjects);

    // Construct selectedActivities with correctly mapped option IDs
    const selectedActivities = Object.keys(selectedSubjects)
        .filter((questionId) => selectedSubjects[questionId])
        .map((questionId) => {
            // Extract option IDs correctly
            const optionsIds = Object.keys(selectedSubjects[questionId])
                .filter((optionIndex) => selectedSubjects[questionId][optionIndex])
                .map((optionIndex) => {
                    // Ensure this maps to the correct ID for the API
                    return parseInt(optionIndex, 10); 
                });
            console.log('Options IDs for question:', questionId, optionsIds);
            return { questionId: parseInt(questionId, 10), optionsIds };
        })
        .filter((activity) => activity.optionsIds.length > 0);

    if (selectedActivities.length === 0) {
        Alert.alert('Error', 'Please select at least one valid option.');
        return;
    }

    selectedActivities.forEach((activity) => {
        const payload = {
            questionId: activity.questionId,
            optionsIds: activity.optionsIds,
            userID: userId,
        };

        console.log('Submitting payload:', payload); // Add logging for debugging

        dispatch(submitActivitiesApi(payload))
            .unwrap()
            .then((response) => {
                console.log('API response:', response);
                // Handle success (e.g., update UI, show success message)
            })
            .catch((error) => {
                console.log('Submission error:', error);
                Alert.alert('Submission Error', 'An error occurred while submitting your activity. Please try again.');
            });
    });

    setSelectedSubjects({});
    setHoursSpent({});
};
    
    

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flexGrow: 1 }}
   >
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <WelcomeHeader style={styles.header} />
                <Text style={{ color: '#4069E5', left: 140, top: 0, fontSize: 18, fontWeight: 'bold' }}>In Progress</Text>
                <View style={{ backgroundColor: '#4069E5', height: 5, top: 20 }}></View>
                <Text style={{ color: 'black', left: 150, top: 35, fontSize: 20, fontWeight: 'bold', marginBottom: 40 }}>Activity</Text>

                <SubjectList
                    selectedSubjects={selectedSubjects}
                    setSelectedSubjects={setSelectedSubjects}
                    // hoursSpent={hoursSpent}
                    // setHoursSpent={setHoursSpent}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
           
        </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flexGrow: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? 10 : 0, 
        paddingBottom: Platform.OS === 'android' ? 0 : -40,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        padding: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        width: '95%',
        left: 10,
        right: -10,
        alignItems: 'center',
        bottom: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
 
});

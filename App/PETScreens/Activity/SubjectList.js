import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { allActivityApi, allActivityDetails } from '../../../Reducers/ActivityReducer'; 
import LoaderView from '../../Components/LoaderView'; // Ensure this is the correct path to your LoaderView component

export default function SubjectList({ selectedSubjects, setSelectedSubjects, hoursSpent, setHoursSpent }) {
  const dispatch = useDispatch();
  const { questions, status, error } = useSelector(allActivityDetails);

  useEffect(() => {
    dispatch(allActivityApi());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <View style={styles.loaderContainer}>
        <LoaderView />
      </View>
    );
  }


  const handleCheckboxChange = (questionId, optionIndex) => {
    setSelectedSubjects((prev) => {
      const newState = {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [optionIndex]: !prev[questionId]?.[optionIndex],
        },
      };
      console.log('Updated selectedSubjects:', newState);
      return newState;
    });
  };

  const handleHoursChange = (questionId, text) => {
    setHoursSpent((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {questions.map((question) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.questionText}</Text>
            {question.options.map((option, optionIndex) => (
              <View key={optionIndex} style={styles.subjectContainer}>
                <CheckBox
                  checked={!!selectedSubjects[question.id]?.[optionIndex]}
                  onPress={() => handleCheckboxChange(question.id, optionIndex)}
                  containerStyle={styles.checkboxContainer}
                />
                <Text style={styles.subjectText}>{option}</Text>
                {/* {selectedSubjects[question.id]?.[optionIndex] && (
                  <TextInput
                    style={styles.input}
                    placeholder="Hours Spent"
                    placeholderTextColor="#888"
                    keyboardType="decimal-pad"
                    value={hoursSpent[question.id] || ''}
                    onChangeText={(text) => handleHoursChange(question.id, text)}
                  />
                )} */}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { paddingBottom: 20 },
  questionContainer: { marginBottom: 20 },
  questionText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  subjectContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxContainer: { marginLeft: 0, marginRight: 10, padding: 0 },
  subjectText: { fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 5, width: 80, textAlign: 'center' },
});

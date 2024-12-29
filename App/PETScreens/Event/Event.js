import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeHeader from '../../Header/WelcomeHeader';
import { useSelector, useDispatch } from 'react-redux';
import { GetAllEventDatasApi, GetAllEventDetails, GetAllEventStatus } from '../../../Reducers/EventReducer'; 
import LoaderView from '../../Components/LoaderView';
import { useRoute } from '@react-navigation/native';

export default function App() {
  const dispatch = useDispatch();
  const route = useRoute();
  const data = useSelector(GetAllEventDetails);
  const status = useSelector(GetAllEventStatus);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(null);
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    dispatch(GetAllEventDatasApi());
  }, [dispatch]);

  useEffect(() => {
    if (route.params?.fromNotification) {
      setSelectedDate(route.params?.eventDetails?.eventDateRaw);
      setShowEventDetails(route.params?.eventDetails);
    }
  }, [route.params]);

  const markedDates = (Array.isArray(data) ? data : []).reduce((acc, event) => {
    const eventDate = event.eventDateRaw;
    acc[eventDate] = {
      selected: eventDate === selectedDate,
      marked: true,
      selectedColor: '#018CE0',
      customStyles: {
        container: {
          backgroundColor: eventDate === selectedDate ? 'lightblue' : 'white',
        },
        text: {
          color: eventDate === selectedDate ? 'blue' : 'black',
        },
      },
    };
    return acc;
  }, {});

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setShowEventDetails(null); // Clear notification details on day press
  };

  if (status === 'loading') {
    return (
      <View style={styles.loaderContainer}>
        <LoaderView />
      </View>
    );
  }

  const filteredEvents = Array.isArray(data) ? data.filter(event => event.eventDateRaw === selectedDate) : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <WelcomeHeader style={styles.header} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          <Calendar 
            current={currentDate}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              selectedDayBackgroundColor: 'blue',
              todayTextColor: 'red',
              arrowColor: 'blue',
            }}
          />
        </View>

        <View style={styles.eventContainer}>
          {showEventDetails ? (
            <View>
              <Text style={styles.eventDate}>{showEventDetails.eventDate}</Text>
              <View style={styles.eventCard}>
                <Text style={styles.eventIcon}>🏫</Text> 
                <Text style={styles.eventText}>{showEventDetails.eventName}</Text>
                <Text style={styles.eventText}>{showEventDetails.eventPlace}</Text>
                <Text style={styles.eventText}>{showEventDetails.eventTime}</Text>
              </View>
            </View>
          ) : selectedDate ? (
            filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <View key={event.id}>
                  <Text style={styles.eventDate}>{event.eventDate}</Text>
                  <View style={styles.eventCard}>
                    <Text style={styles.eventIcon}>🏫</Text> 
                    <Text style={styles.eventText}>{event.eventName}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>No events for this date.</Text>
            )
          ) : (
            <Text>Please select a date from the calendar.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: Platform.OS === 'android' ? 0 : -40,
  },
  header: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendarContainer: {
    margin: 20,
    borderRadius: 10,
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
    borderRadius: 5,
    borderColor: 'grey',
    backgroundColor: 'white', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventContainer: {
    paddingHorizontal: 10,
  },
  eventDate: {
    marginVertical: 10,
    color: '#999',
  },
  eventCard: {
    backgroundColor: '#f0f4ff',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  eventText: {
    fontSize: 16,
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

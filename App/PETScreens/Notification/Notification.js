import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal, Button, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BackView from '../../Header/BackView';
import { GetAllNotificationsApi, notificationDetails, notificationStatus } from '../../../Reducers/NotificationReducers'; 
import { useSelector, useDispatch } from 'react-redux';
import LoaderView from '../../Components/LoaderView';
import { format } from 'date-fns';

const Notification = () => {
  const [selectedTab, setSelectedTab] = useState('Event Notification');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const notificationData = useSelector(notificationDetails);
  const status = useSelector(notificationStatus);

  // Define event types based on tabs
  const eventTypes = {
    'Event Notification': 0,  // Assuming 0 for Event Notifications
    'Others': 1,  // Assuming 1 for Other Notifications
  };

  useEffect(() => {
    dispatch(GetAllNotificationsApi(eventTypes[selectedTab]));
  }, [dispatch, selectedTab]);

  const handleNotificationPress = (item) => {
    setSelectedNotification(item);
    setModalVisible(true);
  };

  const handleAttendPress = () => {
    if (selectedNotification) {
      setModalVisible(false);
      const markedDates = {
        [selectedNotification.eventDateRaw]: {
          selected: true,
          marked: true,
          selectedColor: '#018CE0',
          customStyles: {
            container: {
              backgroundColor: 'lightblue',
            },
            text: {
              color: 'blue',
            },
          },
        },
      };
    // In Notification screen
    console.log('Navigating with event details:', selectedNotification);
    navigation.navigate('Events', { 
      eventDetails: selectedNotification, 
      fromNotification: true,
      markedDates: markedDates 
    });
    
    } else {
      console.error('No event details available');
    }
  };
  
  


  const renderItem = ({ item }) => (

    <View style={styles.notifyView}>
      <TouchableOpacity style={styles.notificationItem} onPress={() => handleNotificationPress(item)}>
        <Image source={require('../../../assets/images/edu3.jpg')} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.eventName}</Text>
          <Text style={styles.details}>Date: {item.eventDate}</Text>
          <Text style={styles.details}>Time: {item.eventTime}</Text>
          <Text style={styles.venue}>Venue: {item.eventPlace}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.timeAgo}>{item.createdDate}</Text>
    </View>
  );

  const renderContent = () => (
    <FlatList
      data={notificationData}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      style={styles.flatList}
    />
  );

  const formatDate = (date) => {
    const today = new Date();
    const diffDays = Math.floor((today - new Date(date)) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return format(new Date(date), 'EEEE'); // EEEE is used for full day names like Monday, Tuesday
  };

  if (status === 'loading') {
    return (
      <View style={styles.loaderContainer}>
        <LoaderView />
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <BackView heading="Notifications" />

      <View style={styles.header}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Event Notification' && styles.activeTab]}
            onPress={() => setSelectedTab('Event Notification')}
          >
            <Text style={[styles.tabText, selectedTab === 'Event Notification' && styles.activeTabText]}>
              Event Notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Others' && styles.activeTab]}
            onPress={() => setSelectedTab('Others')}
          >
            <Text style={[styles.tabText, selectedTab === 'Others' && styles.activeTabText]}>
              Others
            </Text>
          </TouchableOpacity>
        </View>

      {status === 'failed'|| notificationData.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'grey'}}>No Data Found.</Text>
        </View>
      ) : (

      <View style={styles.container}>

        <Text style={{ color: 'grey', fontWeight: 'bold', fontSize: 15 }}>{formatDate(new Date())}</Text> 
        {renderContent()}
      </View>
      )}

      {selectedNotification && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{selectedNotification.eventName}</Text>
            <Text style={styles.modaltext}>Date: {selectedNotification.eventDate}</Text>
            <Text style={styles.modaltext}>Time: {selectedNotification.eventTime}</Text>
            <Text style={styles.modaltext}>Venue: {selectedNotification.eventPlace}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Attend" onPress={handleAttendPress} />
              <Button title="Reject" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: Platform.OS === 'android' ? 0 : -40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  flatList: {
    bottom: 20,
    padding: -10,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tab: {
    marginHorizontal: 10,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    color: '#3498db',
  },
  activeTabText: {
    color: '#fff',
  },
  notifyView:{
   backgroundColor: 'white'
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 15,
    backgroundColor: 'white',
  },
  image: {
    width: 110,
    height: 80,
    borderRadius: 5,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  venue: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  timeAgo: {
    fontSize: 12,
    color: '#757575',
    right: -230
  },
  modalView: {
    margin: 20,
    top: 250,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.40,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black'
  },
  modaltext:{
   padding: 3,
   fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Notification;

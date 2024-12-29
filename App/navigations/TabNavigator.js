import React, { useEffect, useState } from 'react';
import { Image, Keyboard } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeStackNavigator,
  ActivityStackNavigator,
  EventStackNavigator,
  MessageStackNavigator,
  MoreStackNavigator
} from '../router/StackNavigation';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused
              ? require('../../assets/images/homeB.png')
              : require('../../assets/images/homeG.png');
          } else if (route.name === 'Activity') {
            iconName = focused
              ? require('../../assets/images/activityB.png')
              : require('../../assets/images/activityG.png');
          } else if (route.name === 'Events') {
            iconName = focused
              ? require('../../assets/images/eventB.png')
              : require('../../assets/images/eventG.png');
          } else if (route.name === 'Messages') {
            iconName = focused
              ? require('../../assets/images/chatB.png')
              : require('../../assets/images/chatG.png');
          } else if (route.name === 'More') {
            iconName = focused
              ? require('../../assets/images/moreB.png')
              : require('../../assets/images/moreG.png');
          }
          return <Image source={iconName} style={{ width: size, height: size }} />;
        },
        tabBarStyle: {
          backgroundColor: 'white',
          height: 60,
          bottom: keyboardVisible ? -200 : 0, // Adjust tab bar visibility with keyboard
        },
        tabBarActiveTintColor: '#0E6CDF',
        tabBarInactiveTintColor: '#5A5D60',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Activity" component={ActivityStackNavigator} />
      <Tab.Screen name="Events" component={EventStackNavigator} />
      <Tab.Screen name="Messages" component={MessageStackNavigator} />
      <Tab.Screen name="More" component={MoreStackNavigator} />
    </Tab.Navigator>
  );
}

export default TabNavigator;

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../PETScreens/Home/Home';
import ActivityScreen from '../PETScreens/Activity/Activity';
import EventScreen from '../PETScreens/Event/Event';
import MessageScreen from '../PETScreens/Message/ChatScreen/ChatScreen';
import MoreScreen from '../PETScreens/More/More';

const HomeStack = createStackNavigator();
const ActivityStack = createStackNavigator();
const EventStack = createStackNavigator();
const MessageStack = createStackNavigator();
const MoreStack = createStackNavigator();

export function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

export function ActivityStackNavigator() {
  return (
    <ActivityStack.Navigator screenOptions={{ headerShown: false }}>
      <ActivityStack.Screen name="ActivityScreen" component={ActivityScreen} />
    </ActivityStack.Navigator>
  );
}

export function EventStackNavigator() {
  return (
    <EventStack.Navigator screenOptions={{ headerShown: false }}>
      <EventStack.Screen name="EventScreen" component={EventScreen} />
    </EventStack.Navigator>
  );
}

export function MessageStackNavigator() {
  return (
    <MessageStack.Navigator screenOptions={{ headerShown: false }}>
      <MessageStack.Screen name="MessageScreen" component={MessageScreen} />
    </MessageStack.Navigator>
  );
}

export function MoreStackNavigator() {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="MoreScreen" component={MoreScreen} />
    </MoreStack.Navigator>
  );
}

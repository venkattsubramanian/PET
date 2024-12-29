import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../PETScreens/Home/Home';
import Activity from '../PETScreens/Activity/Activity';
import Event from '../PETScreens/Event/Event';
import More from '../PETScreens/More/More';
import ChatScreen from '../PETScreens/Message/ChatScreen/ChatScreen';


const Stack = createStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header
      }}
    >
      <Stack.Screen name="Home+" component={Home} />
    </Stack.Navigator>
  );
}

export function ActivityStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header
      }}
    >
      <Stack.Screen name="Activity+" component={Activity} />
    </Stack.Navigator>
  );
}

export function EventStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header
      }}
    >
      <Stack.Screen name="Event+" component={Event} />
    </Stack.Navigator>
  );
}

export function MessageStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the header
        }}
      >
        <Stack.Screen name="ChatScreen+" component={ChatScreen} />
      </Stack.Navigator>
    );
  }

  export function MoreStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the header
        }}
      >
        <Stack.Screen name="More+" component={More} />
      </Stack.Navigator>
    );
  }

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from '../navigations/TabNavigator';
import Profile from '../PETScreens/Profile/Profile';
import Notification from '../PETScreens/Notification/Notification';
import ChatScreen from '../PETScreens/Message/ChatScreen/ChatScreen';
import Comment from '../PETScreens/Home/Views/Comment';
import Scanner from '../PETScreens/Event/Scanner';

const Stack = createNativeStackNavigator();

function MainStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="Profile">
        {(props) => <Profile {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Scanner" component={Scanner} />
      <Stack.Screen
        name="Comment"
        component={Comment}
        options={{ headerShown: true, presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

export default MainStack;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './Store/index';
import AppNavigator from './App/navigations/AppNavigator';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function MainApp() {
  return (
    <ActionSheetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ActionSheetProvider>
  );
}

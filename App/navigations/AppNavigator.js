import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loginDetails } from '../../Reducers/LoginReducer';
import AuthStack from '../router/AuthStack';
import MainStack from '../router/MainStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginState = useSelector(loginDetails);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await AsyncStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to load auth status:', e);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const authenticated = loginState.loginStatus === 'succeeded' || loginState.signUpStatus === 'succeeded';
    setIsAuthenticated(authenticated);
    
    const saveAuthStatus = async () => {
      try {
        await AsyncStorage.setItem('isAuthenticated', authenticated.toString());
      } catch (e) {
        console.error('Failed to save auth status:', e);
      }
    };

    saveAuthStatus();
  }, [loginState]);

  if (loading) {
    return null;
  }

  return isAuthenticated ? <MainStack setIsAuthenticated={setIsAuthenticated} /> : <AuthStack />;
}


export default AppNavigator;

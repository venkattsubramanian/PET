import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Alert } from 'react-native'; 
import Config from '../Config/Config';

export const loginApi = createAsyncThunk('login/loginApi', async (payload, { rejectWithValue }) => {
  try {
    const url = Config.login;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Network error');
  }
});

export const signUpApi = createAsyncThunk('signUp/signUpApi', async (payload, { rejectWithValue }) => {
  try {
    const url = Config.signUp;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Network error');
  }
});

export const schoolListApi = createAsyncThunk('feed/schoolListApi', async (_, { rejectWithValue }) => {
  try {
    const url = Config.getSchool;
    const response = await axios.get(url);
    if (response.data.status === true && response.data.data) {
      const transformedData = response.data.data.map((school) => ({
        id: school.id,
        schoolName: school.schoolName,
      }));
      return transformedData;
    } else {
      throw new Error('Invalid response from API');
    }
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Network error');
  }
});

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loginStatus: 'idle',
    loginError: null,
    userData: null,
    userId: null,
    signUpStatus: 'idle',
    signUpError: null,
    schoolData: [],
    schoolStatus: 'idle',
    schoolError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginApi.pending, (state) => {
        state.loginStatus = 'loading';
        state.loginError = null;
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded';
        state.userData = action.payload;
        state.userId = action.payload.data.userId; // Save userId to Redux state
      })
      .addCase(loginApi.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.loginError = action.payload;
        Alert.alert('Login Failed', action.payload.message || 'Something went wrong.'); 
      })
      .addCase(signUpApi.pending, (state) => {
        state.signUpStatus = 'loading';
        state.signUpError = null;
      })
      .addCase(signUpApi.fulfilled, (state, action) => {
        state.signUpStatus = 'succeeded';
        state.userData = action.payload;
      })
      .addCase(signUpApi.rejected, (state, action) => {
        state.signUpStatus = 'failed';
        state.signUpError = action.payload;
        Alert.alert('Sign Up Failed', action.payload.message || 'Something went wrong.'); 
      })
      .addCase(schoolListApi.pending, (state) => {
        state.schoolStatus = 'loading';
        state.schoolError = null;
      })
      .addCase(schoolListApi.fulfilled, (state, action) => {
        state.schoolStatus = 'succeeded';
        state.schoolData = action.payload;
      })
      .addCase(schoolListApi.rejected, (state, action) => {
        state.schoolStatus = 'failed';
        state.schoolError = action.payload;
        Alert.alert('Failed to Fetch Schools', action.payload.message || 'Something went wrong.'); 
      });
  },
});

export const loginDetails = (state) => state.login;
export const selectSchoolData = (state) => state.login.schoolData;
export const selectSchoolStatus = (state) => state.login.schoolStatus;
export const selectSchoolError = (state) => state.login.schoolError;

export default loginSlice.reducer;

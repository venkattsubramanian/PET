import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Config from '../Config/Config';

const prettyPrintJSON = (json) => {
    try {
        const jsonString = JSON.stringify(json, null, 2);
        console.log(jsonString);
    } catch (error) {
        console.error("Could not format JSON response.", error);
    }
};

export const allActivityApi = createAsyncThunk(
  'activities/fetchActivities',
  async () => {
    try {
      const url = Config.allActivity;
      const response = await axios.get(url);      
      // prettyPrintJSON(response.data);      
      if (response.status === 200) {
        const transformedQuestions = response.data.data.map(question => ({
          id: question.id,
          questionText: question.questionText,
          options: question.options,
          optionsID: question.optionsID, 
          isMultipleSelect: question.isMultipleSelect, 
        }));
        return { questions: transformedQuestions };
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'API call failed');
    }
  }
);


export const apiCallToSubmitActivity = async (payload) => {
  try {
      const response = await fetch(Config.submitActivities, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json-patch+json', 
          },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok.');
      }

      return response;
  } catch (error) {
      console.error('Error submitting activity:', error);
      throw error;
  }
};

export const submitActivitiesApi = createAsyncThunk(
  'activities/submit',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiCallToSubmitActivity(payload); 
      if (response.ok) {
        const data = await response.json();
        return data; 
      } else {
        return rejectWithValue('Submission failed');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Submission failed');
    }
  }
);




const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    questions: [], 
    status: 'idle',
    error: null,
    submitStatus: 'idle',
    submitError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allActivityApi.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(allActivityApi.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload.questions; 
      })
      .addCase(allActivityApi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(submitActivitiesApi.pending, (state) => {
        state.submitStatus = 'loading';
      })
      .addCase(submitActivitiesApi.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.submitResponse = action.payload; 
      })
      .addCase(submitActivitiesApi.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.submitError = action.payload || 'Failed to submit';
      });
  },
})


export const allActivityDetails = (state) => state.activities;
export default activitiesSlice.reducer;

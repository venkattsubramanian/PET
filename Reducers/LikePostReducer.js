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


export const likeApi = createAsyncThunk('like/likeAPI', async ({ userPostId, userId }, { rejectWithValue }) => {
    try {
        const url = Config.postlike;
        console.log('API Call initiated with URL:', url);
        console.log('Sending payload:', { userPostId, userId });

        const response = await axios.post(url, { userPostId, userId });
        console.log('API Response:', response.data);

        return response.data;
    } catch (error) {
        console.error('API Call failed:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response?.data || 'Failed to add like');
    }
});

  const likeSlice = createSlice({
    name: 'like',
    initialState: {
      likeStatus: 'idle',
      likeError: null,
      likeData: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(likeApi.pending, (state) => {
          state.likeStatus = 'loading';
          state.likeError = null;
        })
        .addCase(likeApi.fulfilled, (state, action) => {
          state.likeStatus = 'succeeded';
          state.likeData = action.payload;
        })
        .addCase(likeApi.rejected, (state, action) => {
          state.likeStatus = 'failed';
          state.likeError = action.payload;
        });
    },
  });
  
  export const likeDetails = (state) => state.like;
  
  export default likeSlice.reducer;
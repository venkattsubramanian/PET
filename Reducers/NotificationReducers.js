import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import Config from '../Config/Config';
import { formatDistanceToNow, format } from 'date-fns';

const initialState = {
  notificationDetails: [],
  notificationStatus: "idle",
  notificationError: null,
};

const prettyPrintJSON = (json) => {
  try {
    const jsonString = JSON.stringify(json, null, 2);
    console.log(jsonString);
  } catch (error) {
    console.error("Could not format JSON response.", error);
  }
};

const formatDate = (dateString) => {
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


export const GetAllNotificationsApi = createAsyncThunk(
  'notify/notificationApi',
  async (eventType, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Config.getNotification}${eventType}`);
      const transformedData = response.data.data.map(post => ({
        id: post.id,
        eventName: post.eventName,
        eventDate: formatDate(post.eventDate),
        eventTime: post.eventTime,
        eventPlace: post.eventPlace,
        createdDate: formatDistanceToNow(new Date(post.createdDate), { addSuffix: true }),
        recipient: post.recipient,
        isSent: post.isSent,
        sentDate: post.sentDate,
        eventType: post.eventType,
        eventImage: post.eventImage,
        messageContent: post.messageContent,
      }));
      return transformedData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



const dataSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllNotificationsApi.pending, (state) => {
        state.notificationStatus = "loading";
      })
      .addCase(GetAllNotificationsApi.fulfilled, (state, action) => {
        state.notificationStatus = "succeeded";
        state.notificationDetails = action.payload;
      })
      .addCase(GetAllNotificationsApi.rejected, (state, action) => {
        state.notificationStatus = "failed";
        state.notificationError = action.error.message;
      });
  },
});

const selectState = (state) => state.notifications;

export const notificationDetails = createSelector(
  selectState,
  (state) => state.notificationDetails
);
export const notificationStatus = createSelector(selectState, (state) => state.notificationStatus);
export const notificationError = createSelector(selectState, (state) => state.notificationError);

export default dataSlice.reducer;

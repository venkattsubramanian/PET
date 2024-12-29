import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import Config from '../Config/Config';

const initialState = {
    GetAllEventDetails: [],
    GetAllEventStatus: "idle",
    GetAllEventError: null,
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

const extractDate = (dateString) => {
  return dateString.split('T')[0]; 
};

export const GetAllEventDatasApi = createAsyncThunk(
  'event/GetAllEventDatasApi',
  async () => {
    try {
      const url = Config.getEvent;
      const response = await axios.get(url);
      // prettyPrintJSON(response.data);
      const transformedData = response.data.data.map(post => ({
        id: post.id,
        eventName: post.eventName,
        eventDate: formatDate(post.eventDate),
        eventDateRaw: extractDate(post.eventDate),
        eventTime: post.eventTime
      }));
      return transformedData;
    } catch (error) {
      return error.response.data;
    }
  }
);

const dataSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllEventDatasApi.pending, (state) => {
        state.GetAllEventStatus = "loading";
      })
      .addCase(GetAllEventDatasApi.fulfilled, (state, action) => {
        state.GetAllEventStatus = "succeeded";
        state.GetAllEventDetails = action.payload;
      })
      .addCase(GetAllEventDatasApi.rejected, (state, action) => {
        state.GetAllEventStatus = "failed";
        state.GetAllEventError = action.error.message;
      });
  },
});

const selectState = (state) => state.event;

export const GetAllEventDetails = createSelector(
  selectState,
  (state) => state.GetAllEventDetails
);
export const GetAllEventStatus = createSelector(selectState, (state) => state.GetAllEventStatus);
export const GetAllEventError = createSelector(selectState, (state) => state.GetAllEventError);

export default dataSlice.reducer;
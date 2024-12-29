import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "../Config/Config";

const initialState = {
  profileDetails: null,
  profileStatus: "idle",
  profileError: null,
};

const prettyPrintJSON = (json) => {
    try {
      const jsonString = JSON.stringify(json, null, 2);
      console.log(jsonString);
    } catch (error) {
      console.error("Could not format JSON response.", error);
    }
  };

export const profileApi = createAsyncThunk(
    'profile/profileApi',
    async (userId) => {
      try {
        const response = await axios.get(`${Config.getProfile}${userId}`);
        // prettyPrintJSON(response.data);
        const profileData = response.data.data.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          mobileNo: profile.mobileNo,
          gender: profile.gender,
        }))[0];
  
        return { profile: profileData };
      } catch (error) {
        console.error("Error fetching profile:", error); 
        throw new Error(error.response?.data.message || 'Failed to fetch profile');
      }
    }
  );
  

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileApi.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(profileApi.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.profileDetails = action.payload.profile; 
      })
      .addCase(profileApi.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.profileError = action.error.message;
      });
  },
});

const selectState = (state) => state.profile;

export const profileDetails = createSelector(
  selectState,
  (state) => state.profileDetails
);

export const profileStatus = createSelector(selectState, (state) => state.profileStatus);

export const profileError = createSelector(selectState, (state) => state.profileError);

export default profileSlice.reducer;

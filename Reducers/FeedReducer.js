import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import Config from '../Config/Config';
import { formatDistanceToNow } from 'date-fns';

const initialState = {
  feedDetails: [],
  feedStatus: "idle",
  feedError: null,
};

const prettyPrintJSON = (json) => {
  try {
    const jsonString = JSON.stringify(json, null, 2);
    console.log(jsonString);
  } catch (error) {
    console.error("Could not format JSON response.", error);
  }
};

export const newsFeedApi = createAsyncThunk(
  'feed/newsFeedApi',
  async () => {
    try {
      const url = Config.feedData; // Ensure this points to your API endpoint
      const response = await axios.get(url);

      if (response.data.status) {
        const transformedData = response.data.data.map(post => ({
          postId: post.postId,
          postUserId: post.postUserId,
          postUserName: post.postUserName || 'Anonymous', // Fallback for user name
          postDescription: post.postDescription || 'No description', // Fallback for description
          profileImageUrl: 'https://api.parentengagementtracker.com/Uploads/UserPost/967c943a-6ad5-4dbe-a603-3abf2229c8ad_back-image - Copy - Copy.jpg', // Update this with the actual logic for profile image
          postImageUrl: post.postImageUrl[0] || null, // Get the first image URL
          postVideoUrl: post.postVideoUrl, // Get the first video URL (if applicable)
          postDocumentUrl: post.postDocumentUrl, // Get the first document URL (if applicable)
          files: post.files, // Keep the original files array if needed
          schoolName: post.schoolName || 'Unknown School', // Fallback for school name
          createdDate: formatDistanceToNow(new Date(post.createdDate), { addSuffix: true }),
          commentCount: post.commentCount,
          likeCount: post.likeCount,
          isLike: post.isLike,
        }));

        return transformedData;
      } else {
        console.error(response.data.message);
        throw new Error(response.data.message); // Throw error for rejection
      }
    } catch (error) {
      return error.response?.data || error.message; // Handle errors
    }
  }
);

const dataSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newsFeedApi.pending, (state) => {
        state.feedStatus = "loading";
      })
      .addCase(newsFeedApi.fulfilled, (state, action) => {
        state.feedStatus = "succeeded";
        state.feedDetails = action.payload;
      })
      .addCase(newsFeedApi.rejected, (state, action) => {
        state.feedStatus = "failed";
        state.feedError = action.error.message;
      });
  },
});

const selectState = (state) => state.account;

export const feedDetails = createSelector(
  selectState,
  (state) => state.feedDetails
);
export const feedStatus = createSelector(selectState, (state) => state.feedStatus);
export const feedError = createSelector(selectState, (state) => state.feedError);

export default dataSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FormData from 'form-data'; 
import Config from '../Config/Config';

const prettyPrintJSON = (json) => {
  try {
    const jsonString = JSON.stringify(json, null, 2);
    console.log(jsonString);
  } catch (error) {
    console.error("Could not format JSON response.", error);
  }
};

// GET comment
export const getCommentApi = createAsyncThunk(
  'comment/getComment',
  async (postId) => {
    try {
      const url = Config.getComment;
      const response = await axios.get(`${url}${postId}`);
      // prettyPrintJSON(response.data);
      const comments = response.data.data.map(comment => ({
        id: comment.id,
        userPostId: comment.userPostId,
        userId: comment.userId,
        content: comment.content,
      })).reverse();
      return { comments };
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch comments');
    }
  }
);

// GET commentCount
export const getCommentCountApi = createAsyncThunk(
  'comment/getCommentCount',
  async (postId) => {
    try {
      const url = Config.getCommentCount;
      const response = await axios.get(`${url}${postId}/CommentCount`);
      // prettyPrintJSON(response.data);
      const commentCount = response.data.data;
      return { commentCount };
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch comment count');
    }
  }
);

// post Comment
export const commentApi = createAsyncThunk('comment/commentAPI', async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('UserPostId', payload.userPostId);
    formData.append('Content', payload.content);
    formData.append('UserId', payload.userId);
    const url = Config.postComment
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to add comment');
  }
});


export const editCommentApi = createAsyncThunk(
  'comment/editComment',
  async ({ commentId, updatedData }, { rejectWithValue }) => {
    try {
      console.log('Editing comment with ID:', commentId);
      console.log('Updated Data:', updatedData);
      const requestBody = {
        commentId: commentId,
        commentText: updatedData.content 
      };
      const url = Config.editComment
      const response = await axios.post(url,requestBody,
        {
          headers: {
            'Content-Type': 'application/json-patch+json', 
            'Accept': 'text/plain' 
          }
        }
      );
      console.log('Edit comment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to edit comment:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to edit comment');
    }
  }
);

// DELETE comment
export const deleteCommentApi = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const requestBody = JSON.stringify(commentId);
      const url = Config.deleteComment
      const response = await axios.post(url,requestBody,
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
            'Accept': 'text/plain',
          }
        }
      );
      console.log('Delete API response:', response.data);
      return commentId; 
    } catch (error) {
      console.error('Delete API error response:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to delete comment');
    }
  }
);


const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    getcommentStatus: 'idle',
    getcommentError: null,
    getcommentData: null,
    getcommentCountStatus: 'idle',
    getcommentCountError: null,
    getcommentCountData: null,
    commentStatus: 'idle',
    commentError: null,
    commentData: null,
    editcommentStatus: 'idle',
    editcommentError: null,
    editcommentData: null,
    deleteCommentStatus: 'idle',
    deleteCommentError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommentApi.pending, (state) => {
        state.getcommentStatus = 'loading';
        state.getcommentError = null;
      })
      .addCase(getCommentApi.fulfilled, (state, action) => {
        state.getcommentStatus = 'succeeded';
        state.getcommentData = action.payload;
      })
      .addCase(getCommentApi.rejected, (state, action) => {
        state.getcommentStatus = 'failed';
        state.getcommentError = action.payload;
      })
      .addCase(getCommentCountApi.pending, (state) => {
        state.getcommentCountStatus = 'loading';
        state.getcommentCountError = null;
      })
      .addCase(getCommentCountApi.fulfilled, (state, action) => {
        state.getcommentCountStatus = 'succeeded';
        state.getcommentCountData = action.payload;
      })
      .addCase(getCommentCountApi.rejected, (state, action) => {
        state.getcommentCountStatus = 'failed';
        state.getcommentCountError = action.payload;
      })
      .addCase(commentApi.pending, (state) => {
        state.commentStatus = 'loading';
        state.commentError = null;
      })
      .addCase(commentApi.fulfilled, (state, action) => {
        state.commentStatus = 'succeeded';
        state.commentData = action.payload;
      })
      .addCase(commentApi.rejected, (state, action) => {
        state.commentStatus = 'failed';
        state.commentError = action.payload;
      })
      .addCase(editCommentApi.pending, (state) => {
        state.editcommentStatus = 'loading';
        state.editcommentError = null;
      })
      .addCase(editCommentApi.fulfilled, (state, action) => {
        state.editcommentStatus = 'succeeded';
        state.editcommentData = action.payload;
      })
      .addCase(editCommentApi.rejected, (state, action) => {
        state.editcommentStatus = 'failed';
        state.editcommentError = action.payload;
      })
      .addCase(deleteCommentApi.pending, (state) => {
        state.deleteCommentStatus = 'loading';
        state.deleteCommentError = null;
      })
      .addCase(deleteCommentApi.fulfilled, (state, action) => {
        state.deleteCommentStatus = 'succeeded';
        if (state.getcommentData) {
          state.getcommentData.comments = state.getcommentData.comments.filter(comment => comment.id !== action.payload);
        }
      })
      .addCase(deleteCommentApi.rejected, (state, action) => {
        state.deleteCommentStatus = 'failed';
        state.deleteCommentError = action.payload;
      });
  },
});

export const getcommentCountData = (state) => state.comment.getcommentCountData?.commentCount;

export const commentDetails = (state) => state.comment;

export default commentSlice.reducer;

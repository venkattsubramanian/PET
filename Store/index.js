import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../Reducers/FeedReducer';
import activitiesReducer from '../Reducers/ActivityReducer';
import LoginReducer from '../Reducers/LoginReducer';
import CommentReducer from '../Reducers/CommentReducer';
import NotificationReducers from '../Reducers/NotificationReducers';
import EventReducer from '../Reducers/EventReducer';
import LikePostReducer from '../Reducers/LikePostReducer';
import ProfileReducer from '../Reducers/ProfileReducer';


const store = configureStore({
  reducer: {
    login: LoginReducer,
    account: dataReducer,
    comment: CommentReducer,
    like: LikePostReducer,
    activities: activitiesReducer,
    notifications: NotificationReducers,
    event: EventReducer,
    profile: ProfileReducer,
  },
});

export default store;

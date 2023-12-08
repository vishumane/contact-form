import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './contactSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export default store;

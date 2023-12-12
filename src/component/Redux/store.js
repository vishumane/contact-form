import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './contactSlice';
import loginReducer from'./loginSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    login :loginReducer
  },
});

export default store;

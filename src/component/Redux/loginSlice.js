import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL, API_ROUTES } from './api';
const initialState = {
  loggedIn: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}${API_ROUTES.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        return response.json();
      } else {
        return rejectWithValue('Login failed. Please try again.');
      }
    } catch (error) {
      return rejectWithValue('An error occurred while logging in.');
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout(state) {
      state.loggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.loggedIn = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;

export default loginSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL, API_ROUTES } from './api';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  try {
    const response = await fetch(
      `${BASE_URL}${API_ROUTES.USERS}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error('Failed to fetch');
  }
});

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}${API_ROUTES.USERS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }) => {
    try {
      const response = await fetch(`${BASE_URL}${API_ROUTES.USERS}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const data = await response.json();
      return { userId, data };
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId) => {
    try {
      const response = await fetch(
        `${BASE_URL}${API_ROUTES.USERS}/${userId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      return userId;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Define additional reducers for specific actions if needed
    userUpdated(state, action) {
      const { userId, updatedUserData } = action.payload;
      const userIndex = state.data.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        state.data[userIndex] = updatedUserData;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { userId, data } = action.payload;
        const userIndex = state.data.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          state.data[userIndex] = data;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = state.data.filter((user) => user.id !== action.payload);
      });
  },
});

export const { userUpdated } = usersSlice.actions;
export default usersSlice.reducer;

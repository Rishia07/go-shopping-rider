import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser, editInfo, changePassword } from "../api/authApi";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_API_KEY}/api/riders/login`,
        credentials
      );

      await SecureStore.setItemAsync("token", response.data.token);
      await SecureStore.setItemAsync("userId", response.data.riderId);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCurrentUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "auth/updateUserInfo",
  async (updatedInfo, { rejectWithValue }) => {
    try {
      const data = await editInfo(updatedInfo);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (updatedPassword, { rejectWithValue }) => {
    try {
      await changePassword(updatedPassword);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      SecureStore.deleteItemAsync("token");
      SecureStore.deleteItemAsync("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

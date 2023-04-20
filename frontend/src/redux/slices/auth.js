import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchUserData = createAsyncThunk(
  "/auth/fetchUserData",
  async (params) => {
    const { data } = await axios.post("/auth/login", params);
    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [fetchUserData.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchUserData.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchUserData.rejected]: (state, action) => {
      state.data = null;
      state.status = "error";
    },
  },
});

export const authReducer = authSlice.reducer;

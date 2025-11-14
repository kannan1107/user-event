import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  reducers: {
    setState: (state, action) => {
      state.token = action.token;
      localStorage.setItem("token", action.token);
      state.user = action.user;
      localStorage.setItem("user", JSON.stringify(action.user));
    },
    clearState: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setState, clearState } = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;

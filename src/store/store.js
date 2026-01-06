import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { appApi } from "../features/ApplicationApi";

const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    auth: authReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});



export default store;
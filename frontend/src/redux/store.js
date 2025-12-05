import { configureStore } from "@reduxjs/toolkit";
import timezoneReduce from "../features/timezone/timezoneSlice";
import profileReduce from "../features/profile/profileSlice";

export const store = configureStore({
    reducer: {
        timezone: timezoneReduce,
        profile: profileReduce,
    }
})
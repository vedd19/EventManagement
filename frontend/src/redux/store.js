import { configureStore } from "@reduxjs/toolkit";
import timezoneReduce from "../features/timezone/timezoneSlice";
import profileReduce from "../features/profile/profileSlice";
import eventReduce from "../features/events/eventSlice"


export const store = configureStore({
    reducer: {
        timezone: timezoneReduce,
        profile: profileReduce,
        event: eventReduce,
    }
})
import { createSlice } from "@reduxjs/toolkit";
import { config } from "../../config";

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profiles: [],
        admin: "",
        startDate: "",
        endDate: "",
        timezone: "",
        startTime: "",
        endTime: ""
    },
    reducers: {
        addProfile: (state, action) => {
            state.profiles = [...action.payload]
        },
        setAdmin: (state, action) => {
            state.admin = action.payload
        },
        setStartDate: ((state, action) => {
            state.startDate = action.payload;
        }),
        setEndDate: ((state, action) => {
            state.endDate = action.payload;
        }),
        setStartTime: ((state, action) => {
            state.startTime = action.payload;
        }),
        setEndTime: ((state, action) => {
            state.endTime = action.payload;
        })
    }
})

export const { addProfile, setAdmin, setEndDate, setStartDate, setStartTime, setEndTime } = profileSlice.actions
export default profileSlice.reducer
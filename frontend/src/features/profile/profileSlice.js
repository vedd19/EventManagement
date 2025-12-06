import { createSlice } from "@reduxjs/toolkit";
import { config } from "../../config";

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profiles: [],
        admin: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        selectedProfiles: [],
        adminId: "",
    },
    reducers: {
        addProfile: (state, action) => {
            state.profiles = [...action.payload]
        },
        setAdmin: (state, action) => {
            state.admin = action.payload
        },
        setStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        setStartTime: (state, action) => {
            state.startTime = action.payload;
        },
        setEndTime: (state, action) => {
            state.endTime = action.payload;
        },
        setSelectedProfiles: (state, action) => {
            state.selectedProfiles = [...action.payload]
        },
        setAdminId: (state, action) => {
            state.adminId = action.payload
        },
        clearEventForm: (state) => {
            state.startDate = ""
            state.endDate = ""
            state.startTime = ""
            state.endTime = ""
            state.selectedProfiles = []
        }
    }
})

export const { addProfile, setAdmin, setEndDate, setStartDate, setStartTime, setEndTime, setAdminId, setSelectedProfiles, clearEventForm } = profileSlice.actions
export default profileSlice.reducer
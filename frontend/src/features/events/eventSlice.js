import { createSlice } from "@reduxjs/toolkit";
import { config } from "../../config";

export const eventSlice = createSlice({
    name: 'event',
    initialState: {
        events: [],
        selectedEvent: null,
        eventLogs: []
    },
    reducers: {
        setEvents: (state, action) => {
            state.events = [...action.payload]
        },
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload
        },
        setEventLogs: (state, action) => {
            state.eventLogs = [...action.payload]
        },
        clearSelectedEvent: (state) => {
            state.selectedEvent = null
            state.eventLogs = []
        }
    }
})

export const { setEvents, setSelectedEvent, setEventLogs, clearSelectedEvent } = eventSlice.actions
export default eventSlice.reducer
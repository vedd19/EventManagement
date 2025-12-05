import { createSlice } from "@reduxjs/toolkit";

export const timezoneSlice = createSlice({
    name: "timezone",
    initialState: {
        count: 0
    },
    reducers: {
        increment: state => {
            state.count += 1
        },
        decrement: state => {
            state.count -= 1
        },
        reset: state => {
            state.count = 0
        },
        incrementByAmount: (state, action) => {
            state.count += action.payload
        }
    },
})

export const { increment, decrement, incrementByAmount, reset } = timezoneSlice.actions

export default timezoneSlice.reducer
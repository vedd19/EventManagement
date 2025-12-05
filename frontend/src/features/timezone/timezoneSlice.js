import { createSlice } from "@reduxjs/toolkit";

export const timezoneSlice = createSlice({
    name: "timezone",
    initialState: {
        timezones: []
    },
    reducers: {
        setTimezones: state => {
            state.timezones = [
                { label: "Eastern Time (ET)", value: "Eastern Time (ET)" },
                { label: "Central Time (CT)", value: "Central Time (CT)" },
                { label: "Mountain Time (MT)", value: "Mountain Time (MT)" },
                { label: "Pacific Time (PT)", value: "Pacific Time (PT)" },
                { label: "Alaska Time (AKT)", value: "Alaska Time (AKT)" },
                { label: "Hawaii Time (HT)", value: "Hawaii Time (HT)" },

                { label: "London (GMT/BST)", value: "London (GMT/BST)" },
                { label: "Paris (CET/CEST)", value: "Paris (CET/CEST)" },
                { label: "Berlin (CET/CEST)", value: "Berlin (CET/CEST)" },

                { label: "India Standard Time (IST)", value: "India Standard Time (IST)" },
                { label: "China Standard Time (CST)", value: "China Standard Time (CST)" },
                { label: "Japan Standard Time (JST)", value: "Japan Standard Time (JST)" },
                { label: "Singapore Time (SGT)", value: "Singapore Time (SGT)" },
                { label: "Hong Kong Time (HKT)", value: "Hong Kong Time (HKT)" },

                { label: "Australia Western Time (AWST)", value: "Australia Western Time (AWST)" },
                { label: "Australia Central Time (ACST)", value: "Australia Central Time (ACST)" },
                { label: "Australia Eastern Time (AEST)", value: "Australia Eastern Time (AEST)" },

                { label: "UAE Time (GST)", value: "UAE Time (GST)" },
                { label: "Saudi Arabia Time (AST)", value: "Saudi Arabia Time (AST)" },

                { label: "Brazil Time (BRT)", value: "Brazil Time (BRT)" },
                { label: "Argentina Time (ART)", value: "Argentina Time (ART)" },

                { label: "Moscow Time (MSK)", value: "Moscow Time (MSK)" },
            ];

        },

    },
})

export const { setTimezones } = timezoneSlice.actions

export default timezoneSlice.reducer
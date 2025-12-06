import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { enqueueSnackbar } from "notistack";

dayjs.extend(utc);
dayjs.extend(timezone);

const timezoneMap = {
    "Eastern Time (ET)": "America/New_York",
    "Central Time (CT)": "America/Chicago",
    "Mountain Time (MT)": "America/Denver",
    "Pacific Time (PT)": "America/Los_Angeles",
    "Alaska Time (AKT)": "America/Anchorage",
    "Hawaii Time (HT)": "Pacific/Honolulu",

    "London (GMT/BST)": "Europe/London",
    "Paris (CET/CEST)": "Europe/Paris",
    "Berlin (CET/CEST)": "Europe/Berlin",

    "India Standard Time (IST)": "Asia/Kolkata",
    "China Standard Time (CST)": "Asia/Shanghai",
    "Japan Standard Time (JST)": "Asia/Tokyo",
    "Singapore Time (SGT)": "Asia/Singapore",
    "Hong Kong Time (HKT)": "Asia/Hong_Kong",

    "Australia Western Time (AWST)": "Australia/Perth",
    "Australia Central Time (ACST)": "Australia/Adelaide",
    "Australia Eastern Time (AEST)": "Australia/Sydney",

    "UAE Time (GST)": "Asia/Dubai",
    "Saudi Arabia Time (AST)": "Asia/Riyadh",

    "Brazil Time (BRT)": "America/Sao_Paulo",
    "Argentina Time (ART)": "America/Argentina/Buenos_Aires",

    "Moscow Time (MSK)": "Europe/Moscow",
};


export const convertToTimezone = (date, timezone) => {
    if (!date || !timezone) return null;

    const ianaTimezone = timezoneMap[timezone];
    if (!ianaTimezone) {
        enqueueSnackbar(`Unknown timezone: ${timezone}`);
        return null;
    }

    try {
        const d = dayjs(date).tz(ianaTimezone);

        return {
            date: d.format("MM/DD/YYYY"),
            time: d.format("HH:mm:ss"),
            dateTime: d.format("MM/DD/YYYY HH:mm"),
            timezone: timezone
        };
    } catch (error) {
        console.error(`Error converting timezone: ${error.message}`);
        return null;
    }
};


export const formatDateForDisplay = (date) => {
    if (!date) return "";

    return dayjs(date).format("MMM DD, YYYY, hh:mm A");
};

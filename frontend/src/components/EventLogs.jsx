import React from "react"
import { formatDateForDisplay } from "@/lib/timezoneUtils"

export function EventLogs({ logs }) {
    if (!logs || logs.length === 0) {
        return <div className="text-gray-500 text-sm">No logs available</div>
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Event Update History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                    <div key={log._id} className="pl-4 py-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-800 leading-relaxed">
                            {log.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            by {log.changedBy?.name || "Unknown"} • {formatDateForDisplay(log.createdAt)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

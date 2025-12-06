import React from "react"
import { Button } from "@/components/ui/button"
import { convertToTimezone, formatDateForDisplay } from "@/lib/timezoneUtils"
import { Calendar, Users, Edit2, Eye } from "lucide-react"
import { Dropdown } from "./Dropdown"

export function EventCard({ event, timezone, onEdit, onViewLogs }) {
    const startFormatted = convertToTimezone(event.startDateObj, timezone || event.timezone)
    const endFormatted = convertToTimezone(event.endDateObj, timezone || event.timezone)

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow">

            <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-sm text-gray-800">Event</h3>
            </div>


            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <p className="text-xs text-gray-600 font-medium">Profiles</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {event.profiles?.map(profile => (
                        <span key={profile._id} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            {profile.name}
                        </span>
                    ))}
                </div>

            </div>


            <div className="mb-4 space-y-3">

                <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-600 font-medium">Start</p>
                        <p className="text-sm font-semibold text-gray-800">
                            {startFormatted?.dateTime || formatDateForDisplay(event.startDateObj)}
                        </p>
                    </div>
                </div>


                <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-600 font-medium">End</p>
                        <p className="text-sm font-semibold text-gray-800">
                            {endFormatted?.dateTime || formatDateForDisplay(event.endDateObj)}
                        </p>
                    </div>
                </div>
            </div>


            <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-1">Timezone</p>
                <p className="text-sm text-gray-700">{event.timezone}</p>
            </div>


            <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p>Created {new Date(event.createdAt).toLocaleDateString()} at {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                {event.updatedAt && event.createdAt !== event.updatedAt && (
                    <p>Updated {new Date(event.updatedAt).toLocaleDateString()} at {new Date(event.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                )}
            </div>


            <div className="flex gap-2">
                <Button
                    onClick={onEdit}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs hover:bg-[#6852df] hover:text-white"
                >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                </Button>
                <Button
                    onClick={onViewLogs}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs hover:bg-[#6852df] hover:text-white"
                >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    View Logs
                </Button>
            </div>
        </div>
    )
}

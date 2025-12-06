import React, { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { EventLogs } from "./EventLogs"
import { config } from "@/config"
import { convertToTimezone } from "@/lib/timezoneUtils"
import { setEvents } from "@/features/events/eventSlice"
import { enqueueSnackbar } from "notistack"

export function EventDetailsModal({ event, isOpen, onClose, currentAdminId, initialMode = "view" }) {
    const [isEditing, setIsEditing] = useState(false)
    const [showLogs, setShowLogs] = useState(false)
    const [eventLogs, setEventLogs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editStartDate, setEditStartDate] = useState("")
    const [editEndDate, setEditEndDate] = useState("")
    const [editStartTime, setEditStartTime] = useState("09:00")
    const [editEndTime, setEditEndTime] = useState("09:00")
    const [editTimezone, setEditTimezone] = useState("")
    const [editProfiles, setEditProfiles] = useState([])

    const dispatch = useDispatch()

    const selectedTimezone = useSelector((state) => state.timezone.selectedTZ)
    const events = useSelector((state) => state.event.events)
    const allProfiles = useSelector((state) => state.profile.profiles)

    const canEdit = event?.creator?._id === currentAdminId

    const handleFetchLogs = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${config.BACKEND_URL}/api/event/get-event-logs/${event._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            setEventLogs(data.data || [])
            setShowLogs(true)
        } catch (err) {
            console.error("Error fetching logs:", err)
            enqueueSnackbar("Error fetching logs")
        } finally {
            setIsLoading(false)
        }
    }, [event._id])


    useEffect(() => {
        if (event && isOpen) {
            const startDate = new Date(event.startDateObj).toISOString().split('T')[0]
            const endDate = new Date(event.endDateObj).toISOString().split('T')[0]
            const startTime = new Date(event.startDateObj).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
            const endTime = new Date(event.endDateObj).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })

            setEditStartDate(startDate)
            setEditEndDate(endDate)
            setEditStartTime(startTime)
            setEditEndTime(endTime)
            setEditTimezone(event.timezone)
            setEditProfiles(event.profiles?.map(p => p._id) || [])

            if (initialMode === "edit") {
                setIsEditing(true)
                setShowLogs(false)
            } else if (initialMode === "logs") {
                setIsEditing(false)
                handleFetchLogs()
            } else {
                setIsEditing(false)
                setShowLogs(false)
            }
        }
    }, [event, isOpen, initialMode, handleFetchLogs])

    const handleUpdateEvent = async () => {
        if (!editStartDate || !editEndDate || !editStartTime || !editEndTime || !editTimezone || editProfiles.length === 0) {
            enqueueSnackbar("Please fill in all fields")
            return
        }

        setIsSaving(true)
        try {
            const formattedStartDate = new Date(`${editStartDate}T${editStartTime}:00`)
            const formattedEndDate = new Date(`${editEndDate}T${editEndTime}:00`)

            const res = await fetch(`${config.BACKEND_URL}/api/event/update-event`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventId: event._id,
                    startDateObj: formattedStartDate,
                    endDateObj: formattedEndDate,
                    profiles: editProfiles,
                    timezone: editTimezone,
                    updatedBy: currentAdminId
                })
            })

            const data = await res.json()

            if (res.ok) {
                const updatedEvents = events.map(e => e._id === event._id ? data.data : e)
                dispatch(setEvents(updatedEvents))
                enqueueSnackbar("Event updated successfully!")
                setIsEditing(false)
                setShowLogs(false)
                onClose()
            } else {
                enqueueSnackbar("Failed to update event", { variant: 'error' })
            }
        } catch (err) {
            console.error("Error updating event:", err)
            enqueueSnackbar("Error updating event", { variant: 'error' })
        } finally {
            setIsSaving(false)
        }
    }

    if (!event) return null

    const startDateFormatted = convertToTimezone(event.startDateObj, selectedTimezone || event.timezone)
    const endDateFormatted = convertToTimezone(event.endDateObj, selectedTimezone || event.timezone)

    const handleFocusEndDate = () => {
        if (!editEndDate) {
            const today = new Date().toISOString().split("T")[0];
            setEditEndDate(today);
        }
    };
    const handleFocusStartDate = () => {
        if (!editStartDate) {
            const today = new Date().toISOString().split("T")[0];
            setEditStartDate(today);
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Event Details
                    </DialogTitle>
                </DialogHeader>

                {!showLogs ? (
                    <div className="space-y-4 py-4">
                        {isEditing ? (
                            <>
                                <div>
                                    <Label className="py-3 font-semibold">Profiles</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-between bg-[#f5f7f9]"
                                            >
                                                {editProfiles.length > 0
                                                    ? `${editProfiles.length} profile(s) selected`
                                                    : "Select profiles..."}
                                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search profiles..." />
                                                <CommandEmpty>No profiles found.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandList>
                                                        {allProfiles?.map((profile) => (
                                                            <CommandItem
                                                                key={profile._id}
                                                                value={profile._id}
                                                                onSelect={() => {
                                                                    if (editProfiles.includes(profile._id)) {
                                                                        setEditProfiles(
                                                                            editProfiles.filter(id => id !== profile._id)
                                                                        )
                                                                    } else {
                                                                        setEditProfiles([...editProfiles, profile._id])
                                                                    }
                                                                }}
                                                            >
                                                                <CheckIcon
                                                                    className={`mr-2 h-4 w-4 ${editProfiles.includes(profile._id)
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                        }`}
                                                                />
                                                                {profile.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandList>
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div>
                                    <Label className="py-3 font-semibold">Timezone</Label>
                                    <select
                                        value={editTimezone}
                                        onChange={(e) => setEditTimezone(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#f5f7f9]"
                                    >
                                        <option value="">Select timezone</option>
                                        <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                                        <option value="Central Time (CT)">Central Time (CT)</option>
                                        <option value="Mountain Time (MT)">Mountain Time (MT)</option>
                                        <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                                        <option value="Alaska Time (AKT)">Alaska Time (AKT)</option>
                                        <option value="Hawaii Time (HT)">Hawaii Time (HT)</option>
                                        <option value="London (GMT/BST)">London (GMT/BST)</option>
                                        <option value="Paris (CET/CEST)">Paris (CET/CEST)</option>
                                        <option value="Berlin (CET/CEST)">Berlin (CET/CEST)</option>
                                        <option value="India Standard Time (IST)">India Standard Time (IST)</option>
                                        <option value="China Standard Time (CST)">China Standard Time (CST)</option>
                                        <option value="Japan Standard Time (JST)">Japan Standard Time (JST)</option>
                                        <option value="Singapore Time (SGT)">Singapore Time (SGT)</option>
                                        <option value="Hong Kong Time (HKT)">Hong Kong Time (HKT)</option>
                                        <option value="Australia Western Time (AWST)">Australia Western Time (AWST)</option>
                                        <option value="Australia Central Time (ACST)">Australia Central Time (ACST)</option>
                                        <option value="Australia Eastern Time (AEST)">Australia Eastern Time (AEST)</option>
                                        <option value="UAE Time (GST)">UAE Time (GST)</option>
                                        <option value="Saudi Arabia Time (AST)">Saudi Arabia Time (AST)</option>
                                        <option value="Brazil Time (BRT)">Brazil Time (BRT)</option>
                                        <option value="Argentina Time (ART)">Argentina Time (ART)</option>
                                        <option value="Moscow Time (MSK)">Moscow Time (MSK)</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <Label className="py-3 font-semibold">Start Date & Time</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="date"
                                                value={editStartDate}
                                                onFocus={handleFocusStartDate}
                                                onChange={(e) => setEditStartDate(e.target.value)}
                                                className="flex-1 bg-[#f5f7f9]"
                                            />
                                            <Input
                                                type="time"
                                                value={editStartTime}
                                                onChange={(e) => setEditStartTime(e.target.value)}
                                                className="w-32 bg-[#f5f7f9]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="py-3 font-semibold">End Date & Time</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="date"
                                                value={editEndDate}
                                                onFocus={handleFocusEndDate}
                                                onChange={(e) => setEditEndDate(e.target.value)}
                                                className="flex-1 bg-[#f5f7f9]"
                                            />

                                            <Input
                                                type="time"
                                                value={editEndTime}
                                                onChange={(e) => setEditEndTime(e.target.value)}
                                                className="w-32 bg-[#f5f7f9]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <Label className="font-semibold">Timezone</Label>
                                    <p className="text-sm">{selectedTimezone || event.timezone}</p>
                                </div>

                                <div>
                                    <Label className="font-semibold">Start Date & Time</Label>
                                    <p className="text-sm">
                                        {startDateFormatted?.dateTime || event.startDateObj}
                                    </p>
                                </div>

                                <div>
                                    <Label className="font-semibold">End Date & Time</Label>
                                    <p className="text-sm">
                                        {endDateFormatted?.dateTime || event.endDateObj}
                                    </p>
                                </div>

                                <div>
                                    <Label className="font-semibold">Profiles</Label>
                                    <div className="text-sm space-y-1">
                                        {event.profiles?.map(p => (
                                            <p key={p._id}>{p.name}</p>
                                        )) || "No profiles"}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <EventLogs logs={eventLogs} />
                )}

                <DialogFooter className="flex gap-2 justify-end flex-wrap">
                    {!showLogs && canEdit && !isEditing && (
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Event
                        </Button>
                    )}

                    {isEditing && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#6852df]"
                                onClick={handleUpdateEvent}
                                disabled={isSaving}
                            >
                                {isSaving ? "Updating..." : "Update"}
                            </Button>
                        </>
                    )}

                    {!isEditing && !showLogs && (
                        <Button
                            variant="outline"
                            onClick={handleFetchLogs}
                            disabled={isLoading}
                        >
                            View Logs
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

import React, { useEffect, useState } from 'react'
import { Label } from '../components/ui/label'
import { Dropdown } from '../components/Dropdown'
import { Button } from '../components/ui/button'
import { DateField } from '../components/DateField'
import { useDispatch, useSelector } from 'react-redux'
import { config } from '../config'
import { setEvents, clearSelectedEvent } from '../features/events/eventSlice'
import { clearEventForm } from '../features/profile/profileSlice'
import { EventDetailsModal } from '../components/EventDetailsModal'
import { EventCard } from '../components/EventCard'
import { useSnackbar } from 'notistack'


export const Home = () => {

    const dispatch = useDispatch()
    const startDate = useSelector((state) => state.profile.startDate)
    const endDate = useSelector((state) => state.profile.endDate)
    const timezone = useSelector((state) => state.timezone.selectedTZ)
    const startTime = useSelector((state) => state.profile.startTime)
    const endTime = useSelector((state) => state.profile.endTime)
    const selectedprofiles = useSelector((state) => state.profile.selectedProfiles);
    const adminId = useSelector(state => state.profile.adminId)
    const events = useSelector(state => state.event.events)
    const [createEventClicked, setCreateEventClicked] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState("view")

    const { enqueueSnackbar } = useSnackbar();

    const createEventHandler = async () => {

        if (!adminId) {
            enqueueSnackbar("Please select a current profile from the top dropdown first", { variant: 'default' })
            return;
        }

        if (!startDate || !endDate || !startTime || !endTime || !timezone || selectedprofiles.length === 0) {
            enqueueSnackbar("Please fill in all the fieds", { variant: 'default' })
            return
        }

        const formatedStartDateNtime = new Date(`${startDate}T${startTime}:00`);
        const formattedEndDateNtime = new Date(`${endDate}T${endTime}:00`);

        try {
            const payload = {
                startDateObj: formatedStartDateNtime,
                endDateObj: formattedEndDateNtime,
                profiles: selectedprofiles,
                timezone: timezone,
                creator: adminId
            }
            // console.log("Sending payload:", payload)

            const res = await fetch(`${config.BACKEND_URL}/api/event/create-event`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await res.json()
            console.log("Response status:", res.status)
            console.log("Response data:", data)

            if (res.ok) {
                enqueueSnackbar("Event created successfully", { variant: "default" })
                dispatch(clearEventForm())
                setCreateEventClicked(!createEventClicked)
            } else {
                enqueueSnackbar("Failed to create event", { variant: "error" })
            }
        } catch (err) {
            console.error("Error creating event:", err);
            enqueueSnackbar("Error creating event")
        }
    }

    useEffect(() => {
        async function getEvents() {
            try {
                const res = await fetch(`${config.BACKEND_URL}/api/event/get-events`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json();
                dispatch(setEvents(data.data))
            } catch (err) {
                console.log(err);
            }
        }
        getEvents();
    }, [createEventClicked, dispatch])

    const myEvents = events.filter(event =>
        event.profiles.some(profile => profile._id === adminId)
    )

    const handleEditEvent = (event) => {
        setSelectedEvent(event)
        setModalMode("edit")
        setIsModalOpen(true)
    }

    const handleViewLogs = (event) => {
        setSelectedEvent(event)
        setModalMode("logs")
        setIsModalOpen(true)
    }

    return (
        <div className='container w-[80%]'>
            <div className="flex justify-between py-4">
                <div className="">
                    <h2 className='text-2xl font-bold'>Event Management</h2>
                    <p className='text-gray-600'>Create and manage events accross multiple TimeZones</p>
                </div>

                <div className="">
                    <Dropdown type='profile' key={'userTopProfile'} inForm={false} />
                </div>
            </div>

            <div className=" flex gap-3 w-[100%] h-[600px]">
                <div className="bg-[#fff] w-1/2 p-4 rounded-md shadow-lg">
                    <h2 className='font-medium text-lg'>Create Event</h2>

                    <div className="flex flex-col gap-5">
                        <div className="">
                            <Label className="py-3">Profile</Label>
                            <Dropdown type='profile' key={'userProfile'} inForm={true} />
                        </div>

                        <div className="">
                            <Label className="py-3">Timezone</Label>
                            <Dropdown type='timezone' key={'timezone'} className='w-[100%]' inForm={true} />
                        </div>
                        <div className="">
                            <Label className="py-3">Start Date & Time</Label>
                            <DateField endDateInput={false} className='w-[100%]' />
                        </div>

                        <div className="">
                            <Label className="py-3">End Date & Time</Label>
                            <DateField endDateInput={true} className='w-[100%]' />
                        </div>

                        <div className="w-[100%]">
                            <Button

                                className='bg-[#6852df] w-full'
                                variant="default"
                                size='default'
                                onClick={createEventHandler}
                            >
                                + Create Event
                            </Button>
                        </div>
                    </div>


                </div>

                <div className="bg-[#fff] w-1/2 p-4 rounded-md shadow-lg flex flex-col overflow-hidden">
                    <h2 className='font-medium text-lg mb-4'>My Events</h2>

                    <div className="mb-4">
                        <Label className="py-3">View in Timezone</Label>
                        <Dropdown className='w-[100%]' type='timezone' inForm={false} />
                    </div>


                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {myEvents && myEvents.length > 0 ? (
                            myEvents.map((e) => (
                                <EventCard
                                    key={e._id}
                                    event={e}
                                    timezone={timezone || e.timezone}
                                    onEdit={() => handleEditEvent(e)}
                                    onViewLogs={() => handleViewLogs(e)}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                No events assigned to you
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedEvent(null)
                        setModalMode("view")
                        dispatch(clearSelectedEvent())
                    }}
                    currentAdminId={adminId}
                    initialMode={modalMode}
                />
            )}
        </div>
    )
}

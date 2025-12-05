import React, { useEffect } from 'react'
import { Label } from '../components/ui/label'
import { Dropdown } from '../components/Dropdown'
import { Button } from '../components/ui/button'
import { DateField } from '../components/DateField'
import { useDispatch } from 'react-redux'


export const Home = () => {

    // const createEventHandler = () => {

    // }

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

            <div className=" flex gap-3 w-[100%]">
                <div className="bg-[#fff] w-1/2 p-4 rounded-md shadow-lg">
                    <h2 className='font-medium text-lg'>Creat Event</h2>

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

                <div className="bg-[#fff] w-1/2 p-4 rounded-md shadow-lg">
                    <h2 className='font-medium text-lg'>Events</h2>



                    <div className="">
                        <Label className="py-3">View in Timezone</Label>
                        <Dropdown className='w-[100%]' type='timezone' inForm={false} />
                    </div>

                    <div className="">
                        Details
                    </div>
                </div>
            </div>
        </div>
    )
}

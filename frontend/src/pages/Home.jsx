import React from 'react'
import { Label } from '../components/ui/label'
import { Dropdown } from '../components/Dropdown'
export const Home = () => {
    return (
        <div className='container w-[80%]'>
            <div className="flex justify-between py-4">
                <div className="">
                    <h2 className='text-2xl font-bold'>Event Management</h2>
                    <p className='text-gray-600'>Create and manage events accross multiple TimeZones</p>
                </div>

                <div className="">
                    userlist
                </div>
            </div>

            <div className=" flex gap-3 w-[100%]">
                <div className="bg-[#fff] w-1/2 p-4 rounded-md shadow-lg">
                    <h2 className='font-medium text-lg'>Creat Event</h2>

                    <div className="flex flex-col gap-5">
                        <div className="">
                            <Label className="py-3">Profile</Label>
                            <Dropdown type='timeZone' inForm={false} />
                        </div>

                        <div className="">
                            <Label className="py-3">Timezone</Label>
                            <Dropdown className='w-[100%]' type='timeZone' inForm={false} />
                        </div>
                        <div className="">
                            <Label className="py-3">Start Date & Time</Label>
                            <Dropdown type='timeZone' inForm={false} />
                        </div>
                        <div className="">
                            <Label className="py-3">End Date & Time</Label>
                            <Dropdown type='timeZone' inForm={false} />
                        </div>
                    </div>


                </div>

                <div className="bg-[#fff] w-1/2 p-4 rounded-md shadow-lg">
                    <h2 className='font-medium text-lg'>Events</h2>



                    <div className="">
                        <Label className="py-3">View in Timezone</Label>
                        <Dropdown className='w-[100%]' type='timeZone' inForm={false} />
                    </div>

                    <div className="">
                        Details
                    </div>



                </div>
            </div>
        </div>
    )
}

import React from 'react'
import { Label } from '../components/ui/label'
export const Home = () => {
    return (
        <div className='container w-[80%]'>
            <div className="flex justify-between">
                <div className="">
                    <h2 className='text-2xl font-bold'>Event Management</h2>
                    <p className='text-gray-600'>Create and manage events accross multiple TimeZones</p>
                </div>

                <div className="">
                    userlist
                </div>
            </div>

            <div className="">
                <div className="bg-[#fff] w-[200px]">
                    <h2 className='font-medium text-lg'>Creat Event</h2>

                    <Label>Profile</Label>
                </div>
                <div className="">

                </div>
            </div>
        </div>
    )
}

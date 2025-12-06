"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { useDispatch, useSelector } from "react-redux"
import { setTimezones } from "../features/timezone/timezoneSlice"
import { addProfile, setAdmin, setAdminId, setSelectedProfiles } from "../features/profile/profileSlice"
import { Input } from "./ui/input"
import { config } from "../config"
import { setSelTimeZone } from "../features/timezone/timezoneSlice"

export function Dropdown({ type, inForm }) {
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState([])
    const [selectedTimeZone, setSelectedTimeZone] = React.useState("Select timezone")
    const wrapperRef = React.useRef(null)
    const [showAddProfileInput, setShowAddProfileInput] = React.useState(false);
    const [profileName, setProfileName] = React.useState("")
    // const [admin, setAdmin] = React.useState("")

    const dispatch = useDispatch()
    const timezones = useSelector((state) => state.timezone.timezones)
    const profiles = useSelector((state) => state.profile.profiles)
    const admin = useSelector((state) => state.profile.admin)
    const selectedTZFromRedux = useSelector((state) => state.timezone.selectedTZ)

    console.log(admin)
    console.log(profiles)

    React.useEffect(() => {
        dispatch(setTimezones())
    }, [dispatch])

    React.useEffect(() => {
        if (selectedTZFromRedux && type === "timezone") {
            setSelectedTimeZone(selectedTZFromRedux)
        }
    }, [selectedTZFromRedux, type])

    React.useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleToggleSelect = (value) => {

        if (inForm) {
            setSelected((prev) => {
                const updated = prev.includes(value)
                    ? prev.filter((v) => v !== value)
                    : [...prev, value]
                dispatch(setSelectedProfiles(updated))
                return updated
            })
        }

    }

    const AddProfileButtonHandler = () => {
        setShowAddProfileInput(true);
    }

    const addProfileLogicHandler = async () => {

        if (!profileName.trim()) return;
        console.log(profileName)

        try {
            const response = await fetch(`${config.BACKEND_URL}/api/profile/add-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profileName })
            })

            const data = await response.json();
            // dispatch(addProfile(data.data));

        } catch (err) {
            console.log(err)
        }


        // await dispatch(addProfile(profileName))
        setShowAddProfileInput(false);
    }

    React.useEffect(() => {
        const getProfiles = async () => {
            try {
                const res = await fetch(`${config.BACKEND_URL}/api/profile/get-profiles`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                const data = await res.json();
                dispatch(addProfile(data.data));

            } catch (err) {
                console.log(err)
            }
        }

        getProfiles()
    }, [showAddProfileInput])



    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-[#f5f7f9]"
                        onClick={() => setOpen(!open)}
                    >
                        {type === "profile" ? (inForm ? (selected.length > 0 ? `${selected.length} profile(s) selected` : "Select profiles") : (admin ? admin : "Select current profile")) : (selectedTimeZone)}




                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent ref={wrapperRef} className="w-[200px] p-0">
                    <Command>
                        <CommandInput
                            placeholder={
                                type === "profile"
                                    ? inForm
                                        ? "Search profiles..."
                                        : "Search current profile..."
                                    : "Search timezones..."
                            }
                        />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>

                            <CommandGroup>
                                {(type === "profile" ? profiles : timezones).map((data) => (
                                    <CommandItem
                                        // key={data.name + "1"}
                                        value={data.name}
                                        onSelect={() => {
                                            if (type === "profile") {
                                                if (!inForm) {
                                                    dispatch(setAdmin(data.name))
                                                    dispatch(setAdminId(data._id))
                                                    setOpen(false)
                                                } else {
                                                    handleToggleSelect(data._id)

                                                }

                                            } else {
                                                setSelectedTimeZone(data.label)
                                                dispatch(setSelTimeZone(data.label))
                                                setOpen(false)
                                            }
                                        }}
                                    >
                                        {type === "profile" && (
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    inForm
                                                        ? selected.includes(data._id)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        : selected.includes(data._id) && selected.length > 0
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                )}
                                            />
                                        )}
                                        {type === "profile" ? data.name : data.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>


                            {!showAddProfileInput ? (<Button
                                variant='otline'
                                className='border-t-1 border-t-gray-300 w-full cursor-pointer'
                                onClick={AddProfileButtonHandler}
                            >
                                +  Add Profile
                            </Button>) :
                                (<div className=" px-1 py-1 flex items-center gap-2 w-[100%]">
                                    <Input
                                        type='text'
                                        placeholder
                                        className='w-3/4'
                                        onChange={(e) => setProfileName(e.target.value)}
                                    />
                                    <Button size='sm' className='1/4 bg-[#6852df] cursor-pointer' onClick={addProfileLogicHandler}>Add</Button>
                                </div>)
                            }
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

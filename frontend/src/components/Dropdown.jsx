"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
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

export function Dropdown({ type, inForm }) {
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState([])
    const [timeZone, setTimeZone] = React.useState("timezone")
    const wrapperRef = React.useRef(null)


    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])


    const handleToggleSelect = (value) => {
        setSelected((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        )
    }

    const users = [{ value: 'user1', label: 'user1' }, { value: 'user2', label: 'user2' }]
    const timezone = [{ value: 'ist', label: 'ist' }, { value: 'gmt', label: 'gmt' }]

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[100%] justify-between bg-[#f5f7f9]"
                        onClick={() => setOpen(!open)}
                    >
                        {selected.length > 0 ? (type === 'profile' ? (inForm ? `${selected.length} profile selected` : selected[0]) : timeZone) : (type === 'profile' ? (inForm ? "Select Profiles" : 'Select current profile') : timeZone)}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent ref={wrapperRef} id="popoverContent" className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder={type === 'profile' ? (inForm ? "Search profiles..." : 'sea current profile...') : 'Search timezone...'} />
                        <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                                {type === 'profile' ? users : timezone.map((data) => (
                                    <CommandItem
                                        key={data.value}
                                        value={data.value}
                                        onSelect={() => handleToggleSelect(data.value)}
                                    >

                                        <CheckIcon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected.includes(data.value)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {data.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

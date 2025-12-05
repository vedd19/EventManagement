"use client"

import * as React from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export function DateField() {
    const [date, setDate] = React.useState(null)
    const [time, setTime] = React.useState("09:00")

    return (
        <div className="flex items-center gap-3 w-[100%] relative">

            <div className="w-3/4">
                <Popover className=''>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "justify-start text-left font-normal w-full bg-[#f5f7f9]",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0 fixed top-0 -translate-x-1/2">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>


            <div className="relative w-1/4">
                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-7 w-[110px] bg-[#f5f7f9]"
                />
            </div>
        </div>
    )
}

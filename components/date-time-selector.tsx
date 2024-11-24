"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ShowTime {
  time: string;
  audioSystem?: string;
}

interface DateTimeSelectorProps {
  onSelect: (date: string, time: string) => void;
  className?: string;
}

export function DateTimeSelector({
  onSelect,
  className,
}: DateTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [dates, setDates] = React.useState<Date[]>([]);

  const showtimes: ShowTime[] = [
    { time: "09:40 AM", audioSystem: "DOLBY 7.1" },
    { time: "11:45 AM" },
    { time: "01:50 PM", audioSystem: "DOLBY 7.1" },
    { time: "03:00 PM", audioSystem: "KOTAK INSIGNIA" },
    { time: "08:45 PM", audioSystem: "DOLBY 7.1" },
  ];

  React.useEffect(() => {
    const generateDates = () => {
      const newDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        newDates.push(date);
      }
      setDates(newDates);
    };
    generateDates();
  }, []);

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]}, ${
      months[date.getMonth()]
    } ${date.getDate()}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    onSelect(selectedDate.toISOString().split("T")[0], time);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 px-1">
          {dates.map((date) => (
            <Button
              key={date.toISOString()}
              variant={
                date.toDateString() === selectedDate.toDateString()
                  ? "default"
                  : "outline"
              }
              className={cn(
                "min-w-[120px] transition-colors",
                date.toDateString() === selectedDate.toDateString() &&
                  "bg-primary text-primary-foreground"
              )}
              onClick={() => handleDateSelect(date)}
            >
              {formatDate(date)}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {showtimes.map((showtime) => (
          <Button
            key={showtime.time}
            variant="outline"
            className="h-auto p-4 flex flex-col items-start space-y-1 hover:border-primary transition-colors"
            onClick={() => handleTimeSelect(showtime.time)}
          >
            <span className="text-base font-semibold">{showtime.time}</span>
            {showtime.audioSystem && (
              <span className="text-xs text-muted-foreground">
                {showtime.audioSystem}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}

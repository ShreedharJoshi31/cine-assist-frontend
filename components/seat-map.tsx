import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SeatMapProps {
  rows: number
  columns: number
  bookedSeats: number[]
  premiumSeats: number[]
  selectedSeats: number[]
  onSeatSelect: (seatNumber: number) => void
}

export function SeatMap({ rows, columns, bookedSeats, premiumSeats, selectedSeats, onSeatSelect }: SeatMapProps) {
  const seatStatus = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) return "booked"
    if (selectedSeats.includes(seatNumber)) return "selected"
    if (premiumSeats.includes(seatNumber)) return "premium"
    return "available"
  }

  const seatPrice = (seatNumber: number) => {
    if (premiumSeats.includes(seatNumber)) return "₹300"
    return "₹200"
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-8">
        <div className="flex justify-center space-x-4">
          {[
            { status: "Available", class: "border-2 border-primary" },
            { status: "Selected", class: "bg-primary" },
            { status: "Premium", class: "bg-yellow-400" },
            { status: "Booked", class: "bg-gray-400" }
          ].map(({ status, class: className }) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={cn("h-4 w-4 rounded", className)} />
              <span className="text-sm">{status}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: rows * columns }).map((_, index) => {
            const seatNumber = index + 1
            const status = seatStatus(seatNumber)
            return (
              <TooltipProvider key={seatNumber}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={status === "premium" ? "secondary" : "outline"}
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0",
                        status === "booked" && "bg-gray-400 hover:bg-gray-400 cursor-not-allowed",
                        status === "selected" && "bg-primary hover:bg-primary",
                        status === "premium" && "bg-yellow-400 hover:bg-yellow-500",
                        status === "available" && "hover:bg-primary/20"
                      )}
                      disabled={status === "booked"}
                      onClick={() => onSeatSelect(seatNumber)}
                    >
                      {String.fromCharCode(65 + Math.floor((seatNumber - 1) / columns))}{seatNumber % columns || columns}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Seat {String.fromCharCode(65 + Math.floor((seatNumber - 1) / columns))}{seatNumber % columns || columns}</p>
                    <p>Price: {seatPrice(seatNumber)}</p>
                    <p>Type: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
        <div className="flex justify-center">
          <div className="w-1/2 h-2 bg-gray-300 rounded-full" />
        </div>
      </div>
    </ScrollArea>
  )
}


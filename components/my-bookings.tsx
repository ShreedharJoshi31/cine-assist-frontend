import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const bookings = [
  { id: 1, movie: "Oppenheimer", date: "2023-07-30", time: "7:30 PM", theater: "PVR Lower Parel", seats: ["A1", "A2"] },
  { id: 2, movie: "Barbie", date: "2023-08-05", time: "4:00 PM", theater: "INOX Nariman Point", seats: ["C5", "C6", "C7"] },
]

export function MyBookings() {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <CardTitle>{booking.movie}</CardTitle>
            <CardDescription>{booking.date} at {booking.time}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Theater: {booking.theater}</p>
            <p>Seats: {booking.seats.join(", ")}</p>
            <Button className="mt-4">Download Ticket</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


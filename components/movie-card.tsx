import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface MovieCardProps {
  title: string
  poster: string
  rating: number
  onViewShowtimes: () => void
}

export function MovieCard({ title, poster, rating, onViewShowtimes }: MovieCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={poster} alt={title} className="w-full h-48 object-cover rounded-md" />
        <p className="mt-2">Rating: {rating}/10</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onViewShowtimes}>View Showtimes</Button>
      </CardFooter>
    </Card>
  )
}


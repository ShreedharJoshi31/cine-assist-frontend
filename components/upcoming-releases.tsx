import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const upcomingMovies = [
  { id: 1, title: "Dune: Part Two", releaseDate: "2024-03-01", poster: "/placeholder.svg?height=300&width=200" },
  { id: 2, title: "The Marvels", releaseDate: "2023-11-10", poster: "/placeholder.svg?height=300&width=200" },
  { id: 3, title: "Wonka", releaseDate: "2023-12-15", poster: "/placeholder.svg?height=300&width=200" },
]

export function UpcomingReleases() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {upcomingMovies.map((movie) => (
        <Card key={movie.id}>
          <CardHeader>
            <CardTitle>{movie.title}</CardTitle>
            <CardDescription>Release Date: {movie.releaseDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover rounded-md mb-4" />
            <Button className="w-full">Set Reminder</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


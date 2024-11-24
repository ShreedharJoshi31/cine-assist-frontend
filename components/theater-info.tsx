import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TheaterInfoProps {
  theater: {
    id: number
    name: string
    location: string
    distance: string
    amenities: string[]
    movies: number[]
  }
  movies: {
    id: number
    title: string
    poster: string
    rating: number
  }[]
  onSelectMovie: (movie: { id: number; title: string; poster: string; rating: number }) => void
}

export function TheaterInfo({ theater, movies, onSelectMovie }: TheaterInfoProps) {
  const theaterMovies = movies.filter(movie => theater.movies.includes(movie.id))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{theater.name}</CardTitle>
          <CardDescription>{theater.location} - {theater.distance}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Amenities: {theater.amenities.join(", ")}</p>
        </CardContent>
      </Card>
      <h3 className="text-lg font-semibold mt-4">Movies Playing:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {theaterMovies.map(movie => (
          <Card key={movie.id}>
            <CardHeader>
              <CardTitle>{movie.title}</CardTitle>
              <CardDescription>Rating: {movie.rating}/10</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover rounded-md mb-4" />
              <Button className="w-full" onClick={() => onSelectMovie(movie)}>Book Tickets</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


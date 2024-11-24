import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TheaterCardProps {
  name: string
  distance: string
  amenities: string[]
  onSelectShow: () => void
}

export function TheaterCard({ name, distance, amenities, onSelectShow }: TheaterCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Distance: {distance}</p>
        <p>Amenities: {amenities.join(", ")}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onSelectShow}>Select Show</Button>
      </CardFooter>
    </Card>
  )
}


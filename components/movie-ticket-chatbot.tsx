"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";
import {
  Moon,
  Sun,
  Mic,
  Home,
  Search,
  Calendar,
  Ticket,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Custom components
import { MovieCard } from "./movie-card";
import { TheaterCard } from "./theater-card";
import { SeatMap } from "./seat-map";
// import { UpcomingReleases } from "./upcoming-releases";
import { MyBookings } from "./my-bookings";
import { TheaterInfo } from "./theater-info";
import { DateTimeSelector } from "./date-time-selector";
import { auth } from "@/firebase.config";
import axios from "axios";
// Declare SpeechRecognition globally for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = {
  results: any;
  new (): {
    start(): void;
    stop(): void;
    onstart: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
  };
};

// Sample data
const movies = [
  {
    id: 1,
    title: "Oppenheimer",
    poster: "/placeholder.svg?height=300&width=200",
    rating: 8.5,
  },
  {
    id: 2,
    title: "Barbie",
    poster: "/placeholder.svg?height=300&width=200",
    rating: 7.8,
  },
  {
    id: 3,
    title: "Mission: Impossible - Dead Reckoning Part One",
    poster: "/placeholder.svg?height=300&width=200",
    rating: 7.9,
  },
];

const theaters = [
  {
    id: 1,
    name: "PVR Lower Parel",
    location: "Lower Parel",
    distance: "2.5 km",
    amenities: ["Recliner", "Dolby Atmos"],
    movies: [1, 2, 3],
  },
  {
    id: 2,
    name: "INOX Nariman Point",
    location: "Nariman Point",
    distance: "3.8 km",
    amenities: ["IMAX", "4DX"],
    movies: [1, 3],
  },
  {
    id: 3,
    name: "Cinepolis Andheri",
    location: "Andheri",
    distance: "5.2 km",
    amenities: ["Recliner", "IMAX"],
    movies: [2, 3],
  },
  {
    id: 4,
    name: "PVR Phoenix Palladium",
    location: "Lower Parel",
    distance: "2.7 km",
    amenities: ["Recliner", "Dolby Atmos", "IMAX"],
    movies: [1, 2, 3],
  },
];

export default function MovieTicketChatbot() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const username = auth.currentUser?.displayName;
  console.log("username", auth.currentUser?.displayName);
  // State initialization with proper types
  const [messages, setMessages] = React.useState<
    { type: "bot" | "user"; content: string }[]
  >([
    {
      type: "bot",
      content:
        "Hi! I'm CineYatri, your movie ticket assistant! How can I help you today?",
    },
  ]);
  const [input, setInput] = React.useState<string>("");
  const [currentFlow, setCurrentFlow] = React.useState<string>("landing");
  const [selectedMovie, setSelectedMovie] = React.useState<
    (typeof movies)[number] | null
  >(null);
  const [selectedTheater, setSelectedTheater] = React.useState<
    (typeof theaters)[number] | null
  >(null);
  const [selectedShowtime, setSelectedShowtime] = React.useState<string | null>(
    null
  );
  const [selectedSeats, setSelectedSeats] = React.useState<number[]>([]);
  const [searchedTheaters, setSearchedTheaters] = React.useState<
    typeof theaters
  >([]);
  const [selectedTheaterInfo, setSelectedTheaterInfo] = React.useState<
    (typeof theaters)[number] | null
  >(null);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(
    new Date().toISOString().split("T")[0]
  );

  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [transcript, setTranscript] = React.useState<string>("");
  const [recognition, setRecognition] =
    React.useState<SpeechRecognition | null>(null);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { type: "user", content: input }]);
      processUserInput(input);
      setInput("");
    }
  };

  const processUserInput = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes("suggest") && lowerInput.includes("theaters")) {
      const location = lowerInput.split("in ")[1];
      if (location) {
        searchTheaters(location);
      } else {
        botReply(
          "I'm sorry, I couldn't understand the location. Can you please specify the area for theater suggestions?"
        );
      }
    } else if (lowerInput.includes("book") && lowerInput.includes("ticket")) {
      setCurrentFlow("movieSearch");
      botReply(
        "Sure, I can help you book a ticket. What movie would you like to watch?"
      );
    } else if (currentFlow === "movieSearch" && selectedMovie === null) {
      const movie = movies.find((m) =>
        m.title.toLowerCase().includes(lowerInput)
      );
      if (movie) {
        handleMovieSelect(movie);
      } else {
        botReply(
          "I'm sorry, I couldn't find that movie. Here are some popular movies playing now:"
        );
      }
    } else if (currentFlow === "theaterSelection" && selectedTheater === null) {
      const theater = theaters.find((t) =>
        t.name.toLowerCase().includes(lowerInput)
      );
      if (theater) {
        handleTheaterSelect(theater);
      } else {
        botReply(
          `I'm sorry, I couldn't find that theater. Here are some theaters showing ${selectedMovie?.title}:`
        );
      }
    } else if (
      currentFlow === "showtimeSelection" &&
      selectedShowtime === null
    ) {
      botReply("Great! Please select a date and time from the options below.");
    } else if (currentFlow === "seatSelection" && selectedSeats.length === 0) {
      const seatNumbers = lowerInput.match(/\d+/g);
      if (seatNumbers) {
        seatNumbers.forEach((seat) => handleSeatSelect(parseInt(seat)));
        botReply(
          `Great! You've selected seats ${selectedSeats.join(
            ", "
          )}. Is there anything else you'd like to add or change?`
        );
      } else {
        botReply(
          "I'm sorry, I couldn't understand the seat numbers. Please select your seats from the seat map below:"
        );
      }
    } else {
      botReply(
        "I'm sorry, I didn't understand that. Can you please rephrase or choose from the options below?"
      );
    }
  };

  const searchTheaters = (location: string) => {
    const foundTheaters = theaters.filter((theater) =>
      theater.location.toLowerCase().includes(location.toLowerCase())
    );
    if (foundTheaters.length > 0) {
      setSearchedTheaters(foundTheaters);
      setCurrentFlow("theaterSearch");
      botReply(`Here are the theaters I found in ${location}:`);
    } else {
      botReply(
        "I'm sorry, I couldn't find any theaters in ${location}. Would you like to search in a different area?"
      );
    }
  };

  const botReply = (message: string) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", content: message }]);
    }, 500);
  };

  const handleMovieSelect = (movie: (typeof movies)[number]) => {
    setSelectedMovie(movie);
    setCurrentFlow("theaterSelection");
    botReply(
      `Great choice! Here are some theaters showing ${movie.title}. Which theater would you like?`
    );
  };

  const handleTheaterSelect = (theater: (typeof theaters)[number]) => {
    setSelectedTheater(theater);
    setCurrentFlow("showtimeSelection");
    botReply(
      `Excellent! Now, let's choose a showtime for ${selectedMovie?.title} at ${theater.name}.`
    );
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedShowtime(time);
    setCurrentFlow("seatSelection");
    botReply(
      `Great! You've selected ${date} at ${time}. Now, let's choose your seats.`
    );
  };

  const handleSeatSelect = (seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleTheaterInfo = (theater: (typeof theaters)[number]) => {
    setSelectedTheaterInfo(theater);
    setCurrentFlow("theaterInfo");
    botReply(`Here's the information for ${theater.name}:`);
  };

  const startListening = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: SpeechRecognition) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
      recognition.start();
    } else {
      console.error("Speech recognition not supported");
    }
  };

  const stopListening = () => {
    if (recognition) {
      (recognition as any).stop();
    }
  };

  const handleVoiceSubmit = () => {
    if (transcript) {
      setInput(transcript);
      handleSend();
      setTranscript("");
    }
  };

  const handleLogout = async () => {
    const response = await axios.post("http://127.0.0.1:8000/user/logout", {
      email: auth.currentUser?.email,
    });
    localStorage.removeItem("user");

    console.log(response.data);
    console.log(response.status);

    await auth.signOut();
    router.push("/login");
  };
  const renderContent = () => {
    switch (currentFlow) {
      case "movieSearch":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                poster={movie.poster}
                rating={movie.rating}
                onViewShowtimes={() => handleMovieSelect(movie)}
              />
            ))}
          </div>
        );
      // case "theaterSelection":
      //   return (
      //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      //       {theaters.map((theater) => (
      //         <TheaterCard
      //           key={theater.id}
      //           name={theater.name}
      //           distance={theater.distance}
      //           amenities={theater.amenities}
      //           onSelectShow={() => handleTheaterSelect(theater)}
      //         />
      //       ))}
      //     </div>
      //   );
      case "theaterSearch":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedTheaters.map((theater) => (
              <TheaterCard
                key={theater.id}
                name={theater.name}
                distance={theater.distance}
                amenities={theater.amenities}
                onSelectShow={() => handleTheaterInfo(theater)}
              />
            ))}
          </div>
        );
      case "theaterInfo":
        return (
          selectedTheaterInfo && (
            <TheaterInfo
              theater={selectedTheaterInfo}
              movies={movies}
              onSelectMovie={handleMovieSelect}
            />
          )
        );
      case "showtimeSelection":
        return (
          <DateTimeSelector
            onSelect={handleDateTimeSelect}
            className="w-full max-w-4xl mx-auto"
          />
        );
      case "seatSelection":
        return (
          <div className="space-y-4">
            <SeatMap
              rows={8}
              columns={10}
              bookedSeats={[3, 12, 17, 24, 33, 41, 52, 66, 78]}
              premiumSeats={[
                1, 2, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
              ]}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
            <div>Selected seats: {selectedSeats.join(", ")}</div>
            <Button
              onClick={() => {
                botReply(
                  `Great! You've selected seats ${selectedSeats.join(
                    ", "
                  )}. Your total comes to ₹${
                    selectedSeats.length * 200
                  }. Proceeding to payment...`
                );
                setCurrentFlow("payment");
              }}
            >
              Proceed to Payment
            </Button>
          </div>
        );
      // case "upcomingReleases":
      //   return <UpcomingReleases />;
      case "myBookings":
        return <MyBookings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">CineYatri</h1>
        <h1 className="text-2xl font-bold">Hello, {username}!</h1>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={handleLogout}
            className="ml-2 sm:ml-4 text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </header>

      <ScrollArea className="flex-grow p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.type === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {renderContent()}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" onClick={startListening}>
            <Mic className="h-4 w-4" />
            <span className="sr-only">Start voice input</span>
          </Button>
        </div>
      </div>

      <nav className="flex justify-around p-2 border-t">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentFlow("landing")}
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Button>
        {/* <Button variant="ghost" size="icon" onClick={() => setCurrentFlow("movieSearch")}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setCurrentFlow("upcomingReleases")}>
          <Calendar className="h-5 w-5" />
          <span className="sr-only">Upcoming</span>
        </Button> */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentFlow("myBookings")}
        >
          <Ticket className="h-5 w-5" />
          <span className="sr-only">My Bookings</span>
        </Button>
      </nav>

      <Dialog
        open={isListening}
        onOpenChange={(open) => !open && stopListening()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Listening to your voice...</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {transcript ? (
              <p className="text-center">{transcript}</p>
            ) : (
              <p className="text-center text-muted-foreground">Speak now...</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={stopListening}>
              Cancel
            </Button>
            <Button onClick={handleVoiceSubmit} disabled={!transcript}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

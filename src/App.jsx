import { useState, useEffect } from "react";

const mockFlightAPI = {
  flights: [
    {
      id: 1,
      airline: "Jet Airways",
      logo: "✈️",
      flightNo: "9W 212",
      std: "14:15",
      etd: "14:15",
      destination: "AHMEDABAD",
      gate: "1",
      status: "Boarding",
      statusColor: "text-green-400",
    },
    {
      id: 2,
      airline: "Air India",
      logo: "🛩️",
      flightNo: "AI 513",
      std: "14:30",
      etd: "14:30",
      destination: "CHENNAI",
      gate: "1, 2",
      status: "Boarding",
      statusColor: "text-green-400",
    },
    {
      id: 3,
      airline: "SpiceJet",
      logo: "🔴",
      flightNo: "SG 432",
      std: "15:00",
      etd: "15:00",
      destination: "COCHIN",
      gate: "",
      status: "Security", 
      statusColor: "text-yellow-400",
    },
    {
      id: 4,
      airline: "Indigo",
      logo: "🔵",
      flightNo: "6E 756",
      std: "16:15",
      etd: "16:15",
      destination: "DELHI",
      gate: "3",
      status: "Scheduled",
      statusColor: "text-green-400",
    },
    {
      id: 5,
      airline: "Emirates",
      logo: "🟥",
      flightNo: "EK 507",
      std: "16:45",
      etd: "17:00",
      destination: "DUBAI",
      gate: "4",
      status: "Delayed",
      statusColor: "text-red-400",
    },
    {
      id: 6,
      airline: "Qatar Airways",
      logo: "🟣",
      flightNo: "QR 515",
      std: "17:30",
      etd: "17:30",
      destination: "DOHA",
      gate: "5",
      status: "Scheduled",
      statusColor: "text-green-400",
    },
    {
      id: 7,
      airline: "Lufthansa",
      logo: "🟡",
      flightNo: "LH 758",
      std: "18:00",
      etd: "18:00",
      destination: "FRANKFURT",
      gate: "6",
      status: "Boarding",
      statusColor: "text-green-400",
    },
    {
      id: 8,
      airline: "Singapore Airlines",
      logo: "🇸🇬",
      flightNo: "SQ 423",
      std: "18:30",
      etd: "18:30",
      destination: "SINGAPORE",
      gate: "7",
      status: "Scheduled",
      statusColor: "text-green-400",
    },
    {
      id: 9,
      airline: "British Airways",
      logo: "🇬🇧",
      flightNo: "BA 142",
      std: "19:15",
      etd: "19:15",
      destination: "LONDON",
      gate: "8",
      status: "Security",
      statusColor: "text-yellow-400",
    },
    {
      id: 10,
      airline: "Thai Airways",
      logo: "🇹🇭",
      flightNo: "TG 315",
      std: "20:00",
      etd: "20:00",
      destination: "BANGKOK",
      gate: "9",
      status: "Scheduled",
      statusColor: "text-green-400",
    },
    {
      id: 11,
      airline: "American Airlines",
      logo: "🇺🇸",
      flightNo: "AA 127",
      std: "20:45",
      etd: "20:45",
      destination: "NEW YORK",
      gate: "10",
      status: "Boarding",
      statusColor: "text-green-400",
    },
    {
      id: 12,
      airline: "Air France",
      logo: "🇫🇷",
      flightNo: "AF 225",
      std: "21:30",
      etd: "21:30",
      destination: "PARIS",
      gate: "11",
      status: "Scheduled",
      statusColor: "text-green-400",
    },
    {
      id: 13,
      airline: "KLM",
      logo: "🟦",
      flightNo: "KL 644",
      std: "22:15",
      etd: "22:15",
      destination: "AMSTERDAM",
      gate: "12",
      status: "Delayed",
      statusColor: "text-red-400",
    },
    {
      id: 14,
      airline: "Turkish Airlines",
      logo: "🇹🇷",
      flightNo: "TK 714",
      std: "23:00",
      etd: "23:00",
      destination: "ISTANBUL",
      gate: "13",
      status: "Scheduled",
      statusColor: "text-green-400",
    },
    {
      id: 15,
      airline: "Malaysia Airlines",
      logo: "🇲🇾",
      flightNo: "MH 192",
      std: "23:45",
      etd: "23:45",
      destination: "KUALA LUMPUR",
      gate: "14",
      status: "Security",
      statusColor: "text-yellow-400",
    },
    {
      id: 16,
      airline: "Ethiopian Airlines",
      logo: "🟢",
      flightNo: "ET 684",
      std: "00:30",
      etd: "00:30",
      destination: "ADDIS ABABA",
      gate: "15",
      status: "Scheduled",
      statusColor: "text-green-400",
    },
    {
      id: 17,
      airline: "Korean Air",
      logo: "🇰🇷",
      flightNo: "KE 672",
      std: "01:15",
      etd: "01:15",
      destination: "SEOUL",
      gate: "16",
      status: "Boarding",
      statusColor: "text-green-400",
    },
    {
      id: 18,
      airline: "Japan Airlines",
      logo: "🇯🇵",
      flightNo: "JL 748",
      std: "02:00",
      etd: "02:00",
      destination: "TOKYO",
      gate: "17",
      status: "Scheduled",
      statusColor: "text-green-400",
    },
  ],
};

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <main className="h-screen w-screen bg-airport-blue flex flex-col font-mono overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-black py-4 px-8">
        <div className="flex items-center space-x-4">
          <span className="text-yellow-400 text-5xl">🛫</span>
          <span className="text-green-400 text-5xl font-bold tracking-wider uppercase">
            DEPARTURES
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-green-400 text-3xl font-bold tracking-wider">
            {formatDate(currentTime)}
          </span>
          <span className="text-green-400 text-4xl font-bold tracking-wider">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-airport-blue overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-7 text-white text-xl font-bold text-center bg-airport-blue-light border-b-2 border-white">
            <div className="py-3 border-r border-white uppercase">AIRLINE</div>
            <div className="py-3 border-r border-white uppercase">FLIGHT NO.</div>
            <div className="py-3 border-r border-white uppercase">STD</div>
            <div className="py-3 border-r border-white uppercase">ETD</div>
            <div className="py-3 border-r border-white uppercase">DEST.</div>
            <div className="py-3 border-r border-white uppercase">GATE</div>
            <div className="py-3 uppercase">STATUS</div>
          </div>
          
          {/* Table Rows */}
          <div className="flex-1 overflow-y-auto">
            {mockFlightAPI.flights.map((flight, idx) => (
              <div
                key={flight.id}
                className={`grid grid-cols-7 text-white text-lg text-center border-b border-white ${
                  idx % 2 === 0 ? "bg-airport-blue" : "bg-airport-blue-light"
                }`}
              >
                <div className="flex items-center justify-center py-3 border-r border-white">
                  <span className="text-2xl mr-3">{flight.logo}</span>
                  <span className="text-base font-bold">{flight.airline}</span>
                </div>
                <div className="py-3 border-r border-white font-mono font-bold text-xl">
                  {flight.flightNo}
                </div>
                <div className="py-3 border-r border-white font-mono text-xl">
                  {flight.std}
                </div>
                <div className="py-3 border-r border-white font-mono text-xl font-bold">
                  {flight.etd}
                </div>
                <div className="py-3 border-r border-white font-bold text-xl tracking-wider">
                  {flight.destination}
                </div>
                <div className="py-3 border-r border-white font-mono font-bold text-xl">
                  {flight.gate || "—"}
                </div>
                <div className={`py-3 font-bold text-lg uppercase ${flight.statusColor}`}>
                  {flight.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
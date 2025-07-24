import { useState, useEffect, useRef } from 'react';

const mockFlightDataSets = [
  // Dataset 1 - Mix of Indian and International
  [
    { 
      id: 1, 
      airline: "Air India", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Air_India_Logo.svg/200px-Air_India_Logo.svg.png",
      time: "12:00", 
      destination: "MUMBAI", 
      flight: "AI 131", 
      std: "12:00",
      etd: "12:05",
      gate: "A12", 
      status: "Delayed",
      statusClass: "status-delayed"
    },
    { 
      id: 2, 
      airline: "Emirates", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png",
      time: "12:05", 
      destination: "DUBAI", 
      flight: "EK 512", 
      std: "12:05",
      etd: "12:05",
      gate: "B15", 
      status: "Boarding",
      statusClass: "status-boarding"
    },
    { 
      id: 3, 
      airline: "IndiGo", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/IndiGo_logo.svg/200px-IndiGo_logo.svg.png",
      time: "12:10", 
      destination: "DELHI", 
      flight: "6E 2142", 
      std: "12:10",
      etd: "12:10",
      gate: "C08", 
      status: "On Time",
      statusClass: "status-on-time"
    },
    { 
      id: 4, 
      airline: "Singapore Airlines", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Singapore_Airlines_Logo_2.svg/200px-Singapore_Airlines_Logo_2.svg.png",
      time: "12:15", 
      destination: "SINGAPORE", 
      flight: "SQ 518", 
      std: "12:15",
      etd: "12:15",
      gate: "D22", 
      status: "Gate Open",
      statusClass: "status-gate-open"
    },
    { 
      id: 5, 
      airline: "SpiceJet", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/SpiceJet_Logo.svg/200px-SpiceJet_Logo.svg.png",
      time: "12:20", 
      destination: "BANGALORE", 
      flight: "SG 8194", 
      std: "12:20",
      etd: "12:20",
      gate: "A05", 
      status: "Check-In",
      statusClass: "status-check-in"
    },
    { 
      id: 6, 
      airline: "Lufthansa", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/200px-Lufthansa_Logo_2018.svg.png",
      time: "12:25", 
      destination: "FRANKFURT", 
      flight: "LH 761", 
      std: "12:25",
      etd: "12:25",
      gate: "E11", 
      status: "Scheduled",
      statusClass: "status-scheduled"
    },
    { 
      id: 7, 
      airline: "Vistara", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Vistara_Logo.svg/200px-Vistara_Logo.svg.png",
      time: "12:30", 
      destination: "CHENNAI", 
      flight: "UK 889", 
      std: "12:30",
      etd: "12:35",
      gate: "B07", 
      status: "Final Call",
      statusClass: "status-final-call"
    },
    { 
      id: 8, 
      airline: "Qatar Airways", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Qatar_Airways_Logo.svg/200px-Qatar_Airways_Logo.svg.png",
      time: "12:35", 
      destination: "DOHA", 
      flight: "QR 614", 
      std: "12:35",
      etd: "12:35",
      gate: "C19", 
      status: "Now Boarding",
      statusClass: "status-now-boarding"
    },
    { 
      id: 9, 
      airline: "GoAir", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Go_First_logo.svg/200px-Go_First_logo.svg.png",
      time: "12:40", 
      destination: "KOLKATA", 
      flight: "G8 152", 
      std: "12:40",
      etd: "12:40",
      gate: "A18", 
      status: "Go to Gate",
      statusClass: "status-go-to-gate"
    },
    { 
      id: 10, 
      airline: "British Airways", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/British_Airways_Logo.svg/200px-British_Airways_Logo.svg.png",
      time: "12:45", 
      destination: "LONDON", 
      flight: "BA 142", 
      std: "12:45",
      etd: "13:15",
      gate: "D14", 
      status: "Delayed",
      statusClass: "status-delayed"
    },
  ],
  // Dataset 2 - More Indian domestic and International
  [
    { 
      id: 1, 
      airline: "IndiGo", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/IndiGo_logo.svg/200px-IndiGo_logo.svg.png",
      time: "12:50", 
      destination: "PUNE", 
      flight: "6E 6114", 
      std: "12:50",
      etd: "12:50",
      gate: "B03", 
      status: "Boarding",
      statusClass: "status-boarding"
    },
    { 
      id: 2, 
      airline: "Thai Airways", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Thai_Airways_logo.svg/200px-Thai_Airways_logo.svg.png",
      time: "12:55", 
      destination: "BANGKOK", 
      flight: "TG 315", 
      std: "12:55",
      etd: "12:55",
      gate: "E09", 
      status: "Last Call",
      statusClass: "status-last-call"
    },
    { 
      id: 3, 
      airline: "Air India Express", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Air_India_Logo.svg/200px-Air_India_Logo.svg.png",
      time: "13:00", 
      destination: "KOCHI", 
      flight: "IX 384", 
      std: "13:00",
      etd: "13:00",
      gate: "A09", 
      status: "Gate Closed",
      statusClass: "status-gate-closed"
    },
    { 
      id: 4, 
      airline: "American Airlines", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/American_Airlines_logo_2013.svg/200px-American_Airlines_logo_2013.svg.png",
      time: "13:05", 
      destination: "NEW YORK", 
      flight: "AA 127", 
      std: "13:05",
      etd: "13:05",
      gate: "D25", 
      status: "Departed",
      statusClass: "status-departed"
    },
    { 
      id: 5, 
      airline: "AirAsia India", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/200px-AirAsia_New_Logo.svg.png",
      time: "13:10", 
      destination: "GOA", 
      flight: "I5 719", 
      std: "13:10",
      etd: "13:10",
      gate: "C06", 
      status: "On Time",
      statusClass: "status-on-time"
    },
    { 
      id: 6, 
      airline: "Air France", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/200px-Air_France_Logo.svg.png",
      time: "13:15", 
      destination: "PARIS", 
      flight: "AF 225", 
      std: "13:15",
      etd: "13:45",
      gate: "E16", 
      status: "New Time",
      statusClass: "status-new-time"
    },
    { 
      id: 7, 
      airline: "Jet Airways", 
      logo: "https://logos-world.net/wp-content/uploads/2021/02/Jet-Airways-Logo.png",
      time: "13:20", 
      destination: "AHMEDABAD", 
      flight: "9W 469", 
      std: "13:20",
      etd: "13:20",
      gate: "B12", 
      status: "Cancelled",
      statusClass: "status-cancelled"
    },
    { 
      id: 8, 
      airline: "KLM", 
      logo: "https://logos-world.net/wp-content/uploads/2020/03/KLM-Logo.png",
      time: "13:25", 
      destination: "AMSTERDAM", 
      flight: "KL 872", 
      std: "13:25",
      etd: "13:25",
      gate: "D18", 
      status: "Check-In",
      statusClass: "status-check-in"
    },
    { 
      id: 9, 
      airline: "Alliance Air", 
      logo: "https://logos-world.net/wp-content/uploads/2023/01/Alliance-Air-Logo.png",
      time: "13:30", 
      destination: "JAIPUR", 
      flight: "9I 624", 
      std: "13:30",
      etd: "13:30",
      gate: "A15", 
      status: "Diverted",
      statusClass: "status-diverted"
    },
    { 
      id: 10, 
      airline: "Turkish Airlines", 
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Turkish-Airlines-Logo.png",
      time: "13:35", 
      destination: "ISTANBUL", 
      flight: "TK 714", 
      std: "13:35",
      etd: "13:35",
      gate: "E21", 
      status: "Gate Open",
      statusClass: "status-gate-open"
    },
  ],
  // Dataset 3 - More variety
  [
    { 
      id: 1, 
      airline: "IndiGo", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/IndiGo_logo.svg/200px-IndiGo_logo.svg.png",
      time: "13:40", 
      destination: "HYDERABAD", 
      flight: "6E 7019", 
      std: "13:40",
      etd: "13:40",
      gate: "C12", 
      status: "Final Call",
      statusClass: "status-final-call"
    },
    { 
      id: 2, 
      airline: "Japan Airlines", 
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Japan-Airlines-Logo.png",
      time: "13:45", 
      destination: "TOKYO", 
      flight: "JL 748", 
      std: "13:45",
      etd: "13:45",
      gate: "E08", 
      status: "Boarding",
      statusClass: "status-boarding"
    },
    { 
      id: 3, 
      airline: "SpiceJet", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/SpiceJet_Logo.svg/200px-SpiceJet_Logo.svg.png",
      time: "13:50", 
      destination: "SRINAGAR", 
      flight: "SG 991", 
      std: "13:50",
      etd: "14:20",
      gate: "A21", 
      status: "Delayed",
      statusClass: "status-delayed"
    },
    { 
      id: 4, 
      airline: "Cathay Pacific", 
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Cathay-Pacific-Logo.png",
      time: "13:55", 
      destination: "HONG KONG", 
      flight: "CX 695", 
      std: "13:55",
      etd: "13:55",
      gate: "D09", 
      status: "Now Boarding",
      statusClass: "status-now-boarding"
    },
    { 
      id: 5, 
      airline: "Air India", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Air_India_Logo.svg/200px-Air_India_Logo.svg.png",
      time: "14:00", 
      destination: "BHUBANESWAR", 
      flight: "AI 406", 
      std: "14:00",
      etd: "14:00",
      gate: "B09", 
      status: "Gate Closed",
      statusClass: "status-gate-closed"
    },
    { 
      id: 6, 
      airline: "Ethiopian Airlines", 
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Ethiopian-Airlines-Logo.png",
      time: "14:05", 
      destination: "ADDIS ABABA", 
      flight: "ET 684", 
      std: "14:05",
      etd: "14:05",
      gate: "E19", 
      status: "Scheduled",
      statusClass: "status-scheduled"
    },
    { 
      id: 7, 
      airline: "Vistara", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Vistara_Logo.svg/200px-Vistara_Logo.svg.png",
      time: "14:10", 
      destination: "LUCKNOW", 
      flight: "UK 971", 
      std: "14:10",
      etd: "14:10",
      gate: "C15", 
      status: "On Time",
      statusClass: "status-on-time"
    },
    { 
      id: 8, 
      airline: "Korean Air", 
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Korean-Air-Logo.png",
      time: "14:15", 
      destination: "SEOUL", 
      flight: "KE 672", 
      std: "14:15",
      etd: "14:15",
      gate: "D17", 
      status: "Go to Gate",
      statusClass: "status-go-to-gate"
    },
    { 
      id: 9, 
      airline: "GoAir", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Go_First_logo.svg/200px-Go_First_logo.svg.png",
      time: "14:20", 
      destination: "INDORE", 
      flight: "G8 394", 
      std: "14:20",
      etd: "14:20",
      gate: "A07", 
      status: "Check-In",
      statusClass: "status-check-in"
    },
    { 
      id: 10, 
      airline: "Malaysia Airlines", 
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Malaysia-Airlines-Logo.png",
      time: "14:25", 
      destination: "KUALA LUMPUR", 
      flight: "MH 192", 
      std: "14:25",
      etd: "14:25",
      gate: "E13", 
      status: "Departed",
      statusClass: "status-departed"
    },
  ]
];

const passengerInfo = [
  "📞 AIRPORT INFORMATION: +91-11-2565-2000",
  "🚨 EMERGENCY SERVICES: Dial 100 (Police) | 102 (Ambulance)",
  "🏥 MEDICAL ASSISTANCE: Level 2, Terminal 3 - 24/7 Available",
  "👮 CISF SECURITY: Level 1, Main Concourse - Round the clock",
  "🛍️ DUTY FREE SHOPS: Open 24/7 in Departure areas",
  "🍽️ RESTAURANTS & CAFES: Available on all levels - Multiple cuisines",
  "💰 CURRENCY EXCHANGE: Level 1, Arrival & Departure halls",
  "🚗 TAXI & CAB SERVICES: Pre-paid counters at Ground level",
  "🚌 DELHI METRO: Airport Express Line connects to city",
  "🅿️ PARKING INQUIRY: +91-11-2565-2424 | Online booking available",
  "📱 FREE WiFi: '_GMRFREE' - No password required",
  "🧳 LOST & FOUND: Level 1, Terminal Services - +91-11-2565-2389",
  "♿ SPECIAL ASSISTANCE: Available for elderly & differently abled",
  "🛂 IMMIGRATION HELP: Level 2, International Departure",
  "📍 MEETING POINT: Level 1, Pillar No. 15 - Main waiting area"
];

function DeparturesBoard() {
  const [currentFlights, setCurrentFlights] = useState(mockFlightDataSets[0]);
  const [currentDataSetIndex, setCurrentDataSetIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const tableContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Real-time clock update
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Data refresh every 10 seconds
  useEffect(() => {
    const dataInterval = setInterval(() => {
      // Save current scroll position
      if (tableContainerRef.current) {
        setScrollPosition(tableContainerRef.current.scrollTop);
      }

      // Update to next dataset
      const nextIndex = (currentDataSetIndex + 1) % mockFlightDataSets.length;
      setCurrentDataSetIndex(nextIndex);
      setCurrentFlights(mockFlightDataSets[nextIndex]);

      // Restore scroll position after a small delay to allow rendering
      setTimeout(() => {
        if (tableContainerRef.current) {
          tableContainerRef.current.scrollTop = scrollPosition;
        }
      }, 100);
    }, 10000); // 10 seconds

    return () => clearInterval(dataInterval);
  }, [currentDataSetIndex, scrollPosition]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="board-container">
      <div className="board-inner">
        {/* Header */}
        <div className="board-header">
          <h1>DEPARTURES</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="real-time-clock">
              {formatTime(currentTime)}
            </div>
            <span className="plane-icon">✈</span>
          </div>
        </div>

        {/* Table Container with scroll */}
        <div className="table-container" ref={tableContainerRef}>
          <table className="departure-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Airline</th>
                <th>Flight</th>
                <th>Destination</th>
                <th>STD</th>
                <th>EST</th>
                <th>Gate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentFlights.map((flight) => (
                <tr key={flight.id} className="fade-in">
                  <td>
                    <img 
                      src={flight.logo} 
                      alt={flight.airline}
                      className="airline-logo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </td>
                  <td>{flight.airline}</td>
                  <td>{flight.flight}</td>
                  <td>{flight.destination}</td>
                  <td>{flight.std}</td>
                  <td>{flight.etd}</td>
                  <td>{flight.gate}</td>
                  <td className={flight.statusClass}>{flight.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scrolling Information Ticker */}
        <div className="ticker-container">
          <div className="ticker-content">
            {passengerInfo.map((info, index) => (
              <span key={index} className="ticker-item">
                {info}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeparturesBoard;
import { useState, useEffect, useRef } from 'react';

// Passenger information ticker content
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
  const [currentFlights, setCurrentFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tableContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const apiURL = 'https://fids-api.vercel.app';
  const flightsPerPage = 10; // Number of flights per page

  // Fetch flights from API
  const fetchFlights = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiURL}/api/flights?page=${page}&per_page=${flightsPerPage}`);
      const result = await response.json();
      
      if (result.success) {
        setCurrentFlights(result.flights);
        setCurrentPage(result.pagination.current_page);
        setTotalPages(result.pagination.total_pages);
        setError(null);
      } else {
        setError('Failed to fetch flight data');
      }
    } catch (err) {
      setError('API connection failed. Make sure the Python server is running.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time clock update
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Auto-refresh with pagination every 30 seconds
  useEffect(() => {
    // Initial load
    fetchFlights(currentPage);
    
    const dataInterval = setInterval(() => {
      // Save current scroll position
      if (tableContainerRef.current) {
        setScrollPosition(tableContainerRef.current.scrollTop);
      }

      // Move to next page, or reset to page 1 if at last page
      const nextPage = currentPage >= totalPages ? 1 : currentPage + 1;
      fetchFlights(nextPage);

      // Restore scroll position after a small delay to allow rendering
      setTimeout(() => {
        if (tableContainerRef.current) {
          tableContainerRef.current.scrollTop = scrollPosition;
        }
      }, 100);
    }, 30000); // 30 seconds

    return () => clearInterval(dataInterval);
  }, [currentPage, totalPages, scrollPosition]);

  // Format time utility function
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

        {/* Loading/Error States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>
            Loading flights...
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>
            {error}
          </div>
        )}

        {/* Table Container with scroll */}
        <div className="table-container" ref={tableContainerRef}>
          <table className="departure-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Airline</th>
                <th>Flight</th>
                <th>Destination</th>
                <th>Code</th>
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
                  <td>{flight.destinationCode}</td>
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
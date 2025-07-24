import { useState, useEffect, useRef } from 'react';
import indigoLogo from '../assets/indigo.jpeg';
import airIndiaLogo from '../assets/air india.png';
import airasiaLogo from '../assets/airasia.png';
import americanLogo from '../assets/american.png';
import britishAirwaysLogo from '../assets/british airways.jpeg';
import emiratesLogo from '../assets/emirates.png';
import klmLogo from '../assets/klm.jpeg';
import lufthansaLogo from '../assets/lufthansa.png';
import qatarLogo from '../assets/qatar.png';
import spicejetLogo from '../assets/spicejet.png';
import thaiLogo from '../assets/thai.png';

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

// Function to get airline logo based on airline name
const getAirlineLogo = (airlineName) => {
  const name = airlineName.toLowerCase();
  
  if (name.includes('indigo')) return indigoLogo;
  if (name.includes('air india')) return airIndiaLogo;
  if (name.includes('airasia') || name.includes('air asia')) return airasiaLogo;
  if (name.includes('american')) return americanLogo;
  if (name.includes('british airways')) return britishAirwaysLogo;
  if (name.includes('emirates')) return emiratesLogo;
  if (name.includes('klm')) return klmLogo;
  if (name.includes('lufthansa')) return lufthansaLogo;
  if (name.includes('qatar')) return qatarLogo;
  if (name.includes('spicejet') || name.includes('spice jet')) return spicejetLogo;
  if (name.includes('thai')) return thaiLogo;
  
  return null; // Return null if no logo found
};

function DeparturesBoard() {
  const [currentFlights, setCurrentFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const pageTrackerRef = useRef({ current: 1, total: 1 });
  
  const apiURL = 'https://fids-api.vercel.app';
  const flightsPerPage = 7;

  // Fetch flights from API
  const fetchFlights = async (page = 1, isInitialLoad = false) => {
    console.log(`🔥 Fetching page ${page} (Initial: ${isInitialLoad})`);
    
    if (isInitialLoad) {
      setLoading(true);
    }
    
    try {
      const response = await fetch(`${apiURL}/api/flights?page=${page}&per_page=${flightsPerPage}`);
      const result = await response.json();
      
      if (result.success) {
        // Save scroll position before updating
        const scrollPos = tableContainerRef.current?.scrollTop || 0;
        
        // Update state smoothly
        setCurrentFlights(result.flights);
        setCurrentPage(result.pagination.current_page);
        setTotalPages(result.pagination.total_pages);
        
        // Update refs for interval usage
        pageTrackerRef.current = {
          current: result.pagination.current_page,
          total: result.pagination.total_pages
        };
        
        setError(null);
        if (isInitialLoad) {
          setLoading(false);
        }
        
        // Restore scroll position after state update
        setTimeout(() => {
          if (tableContainerRef.current) {
            tableContainerRef.current.scrollTop = scrollPos;
          }
        }, 50);
        
      } else {
        if (isInitialLoad) {
          setError('Failed to fetch flight data');
          setLoading(false);
        }
      }
    } catch (err) {
      if (isInitialLoad) {
        setError('API connection failed. Make sure the Python server is running.');
        setLoading(false);
      }
      console.error('API Error:', err);
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
    fetchFlights(1, true);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up interval for auto-refresh
    intervalRef.current = setInterval(() => {
      const { current, total } = pageTrackerRef.current;
      const nextPage = current >= total ? 1 : current + 1;
      console.log(`⏰ Auto-refresh: Moving from page ${current} to page ${nextPage}`);
      fetchFlights(nextPage, false);
    }, 30000); // 30 seconds

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

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

        {/* Loading/Error States - Only show loading on initial load */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>
            Loading flights...
          </div>
        )}
        
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>
            {error}
          </div>
        )}

        {/* Table Container with scroll */}
        {!loading && (
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
                  <tr key={flight.id} className="flight-row">
                    <td>
                      {(() => {
                        const logo = getAirlineLogo(flight.airline);
                        return logo ? (
                          <img 
                            src={logo} 
                            alt={flight.airline}
                            className="airline-logo"
                          />
                        ) : (
                          <div className="airline-logo-placeholder"></div>
                        );
                      })()}
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
        )}

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
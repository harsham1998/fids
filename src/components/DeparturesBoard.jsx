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
  // Additional airlines from your API data
  if (name.includes('alliance air')) return airIndiaLogo;
  if (name.includes('gofirst')) return indigoLogo;
  if (name.includes('blue dart')) return emiratesLogo;

  return null; // Return null if no logo found
};

function DeparturesBoard() {
  const [currentFlights, setCurrentFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flightsPerPage, setFlightsPerPage] = useState(7);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tableContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const pageTrackerRef = useRef({ current: 1, total: 1 });

  // API endpoint for flight data with dynamic page size
  const apiURL = 'https://testthdsupplierportal.thdmail.net:8091/Users/GetFlights';

  // Calculate optimal flights per page based on screen height (accounting for ad block)
  const calculateFlightsPerPage = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 120;
    const tickerHeight = 80;
    const tableHeaderHeight = 50;
    const rowHeight = 60;
    const padding = 40;

    const availableHeight = screenHeight - headerHeight - tickerHeight - tableHeaderHeight - padding;
    const maxFlights = Math.floor(availableHeight / rowHeight);

    // Ensure we have at least 5 flights and at most 13 flights per page (with 250px ad block), then add 1
    const optimalFlights = Math.max(5, Math.min(maxFlights, 13)) + 1;
    console.log(`📊 Screen height: ${screenHeight}px, Optimal flights per page: ${optimalFlights} (with video ads + QR)`);

    return optimalFlights;
  };

  // Fullscreen functionality
  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        await document.documentElement.msRequestFullscreen();
      }
      setIsFullscreen(true);
      console.log('📺 Entered fullscreen mode');
    } catch (err) {
      console.log('❌ Could not enter fullscreen:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullscreen(false);
      console.log('📺 Exited fullscreen mode');
    } catch (err) {
      console.log('❌ Could not exit fullscreen:', err);
    }
  };

  // Format date for display
  const formatFlightTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch flights from API with pagination parameters
  const fetchFlights = async (page = 1, isInitialLoad = false) => {
    console.log(`🔥 Fetching page ${page} with ${flightsPerPage} flights per page (Initial: ${isInitialLoad})`);

    if (isInitialLoad) {
      setLoading(true);
    }

    try {
      // Add pagination parameters to the API URL
      const urlWithParams = `${apiURL}?pageNumber=${page}&pageSize=${flightsPerPage}`;
      const response = await fetch(urlWithParams);
      const result = await response.json();

      if (result.JsonData && result.JsonData.Data) {
        // Save scroll position before updating
        const scrollPos = tableContainerRef.current?.scrollTop || 0;

        // Transform the data to match our component format
        const flights = result.JsonData.Data.map(flight => ({
          id: flight.Id,
          airline: flight.Airline,
          flight: flight.FlightNumber,
          destination: flight.Destination,
          destinationCode: flight.DestinationCode,
          std: formatFlightTime(flight.ScheduledDeparture),
          etd: flight.ActualDeparture ? formatFlightTime(flight.ActualDeparture) : formatFlightTime(flight.ScheduledDeparture),
          gate: flight.Gate,
          status: flight.Status,
          statusClass: flight.Status.toLowerCase().replace(/\s+/g, '-')
        }));

        // Use server-side pagination data if available, otherwise calculate from total count
        const totalPages = result.JsonData.TotalPages || Math.ceil(result.JsonData.TotalCount / flightsPerPage);
        const currentPageFromAPI = result.JsonData.PageNumber || page;

        // Update state smoothly
        setCurrentFlights(flights);
        setCurrentPage(currentPageFromAPI);
        setTotalPages(totalPages);

        // Update refs for interval usage
        pageTrackerRef.current = {
          current: currentPageFromAPI,
          total: totalPages
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
        setError('API connection failed. Please check the endpoint.');
        setLoading(false);
      }
      console.error('API Error:', err);
    }
  };

  // Initialize fullscreen mode and screen size calculation
  useEffect(() => {
    // Auto-enter fullscreen on component mount
    const initializeFullscreen = async () => {
      // Small delay to ensure component is mounted
      setTimeout(() => {
        enterFullscreen();
      }, 500);
    };

    initializeFullscreen();

    // Calculate and set optimal flights per page based on screen size
    const optimalFlights = calculateFlightsPerPage();
    setFlightsPerPage(optimalFlights);

    // Handle window resize
    const handleResize = () => {
      const newOptimalFlights = calculateFlightsPerPage();
      if (newOptimalFlights !== optimalFlights) {
        setFlightsPerPage(newOptimalFlights);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle ESC key and fullscreen change events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      // Cleanup event listeners
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Load data when flightsPerPage changes
  useEffect(() => {
    if (flightsPerPage > 0) {
      console.log(`🚀 Loading data with ${flightsPerPage} flights per page`);
      fetchFlights(1, true);
    }
  }, [flightsPerPage]);

  // Auto-refresh with pagination every 30 seconds - only after initial load
  useEffect(() => {
    // Don't set up interval until we have data loaded
    if (loading || flightsPerPage === 0) return;

    console.log(`⏰ Setting up 30-second auto-refresh interval`);

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

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loading]); // Only depend on loading state

  // Real-time clock update
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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

        {/* Main Content Area with Table and Advertisement */}
        {!loading && (
          <div className="main-content" style={{ display: 'flex', gap: '20px', flex: 1, padding: '0 8px' }}>
            {/* Flight Table Container */}
            <div className="table-container" ref={tableContainerRef} style={{ flex: '1' }}>
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

            {/* Advertisement Block with Video and QR Code */}
            <div className="advertisement-block" style={{
              width: '250px',
              minWidth: '250px',
              height: '100%',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              border: '2px solid #ffc600',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div className="ad-header" style={{
                backgroundColor: '#ffc600',
                color: '#000',
                padding: '6px 8px',
                fontWeight: 'bold',
                fontSize: '12px',
                textAlign: 'center'
              }}>
                ADVERTISEMENTS
              </div>

              {/* Video Advertisement Section */}
              <div className="video-ad-content" style={{
                flex: '2',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
{/* Advertisement Placeholder - Always show since video may not load on Vercel */}
                <div className="ad-placeholder" style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: '#fff',
                  textAlign: 'center',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '10px',
                    animation: 'pulse 2s infinite'
                  }}>📺</div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffc600',
                    textShadow: '0 0 5px rgba(255, 198, 0, 0.5)'
                  }}>
                    VIDEO ADS
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#ccc',
                    marginTop: '5px'
                  }}>
                    Your advertisement here
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="qr-section" style={{
                flex: '1',
                backgroundColor: '#2a2a2a',
                borderTop: '1px solid #ffc600',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px'
              }}>
                <div style={{
                  color: '#ffc600',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  textAlign: 'center'
                }}>
                  SCAN QR CODE
                </div>
                <img
                  src="/QR.jpeg"
                  alt="QR Code"
                  style={{
                    width: '180px',
                    height: '180px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    // Fallback to placeholder if QR image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />

                {/* Fallback placeholder when QR image is not available */}
                <div className="qr-placeholder" style={{
                  display: 'none',
                  width: '180px',
                  height: '180px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: '24px'
                }}>
                  📱
                </div>
              </div>
            </div>
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
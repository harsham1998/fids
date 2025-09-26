import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function GateStatus() {
  const { flightNumber } = useParams();
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const API_BASE_URL = 'https://testthdsupplierportal.thdmail.net:8091/Users/GetFlightByNumber';

  const fetchFlightStatus = async () => {
    if (!flightNumber) {
      setError('No flight number provided');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}?flightNumber=${encodeURIComponent(flightNumber)}`);
      const data = await response.json();

      if (data.JsonData) {
        setFlightData(data.JsonData);
        setError(null);
      } else {
        setError('Flight not found');
      }
    } catch (error) {
      setError('Network error. Please check connection.');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFlightStatus();
  }, [flightNumber]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFlightStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [flightNumber]);

  // Real-time clock update
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const parts = dateString.split(' ');
      if (parts.length === 2) {
        const datePart = parts[0];
        const timePart = parts[1];

        const dateComponents = datePart.split('-');
        if (dateComponents.length === 3) {
          const isoDate = `${dateComponents[2]}-${dateComponents[0]}-${dateComponents[1]}T${timePart}`;
          const date = new Date(isoDate);

          if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          }
        }
      }

      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }

      return 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'on time': return '#4CAF50';
      case 'boarding': return '#2196F3';
      case 'final call': return '#FF9800';
      case 'gate closed': return '#F44336';
      case 'delayed': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'departed': return '#9C27B0';
      default: return '#FFC600';
    }
  };

  const getStatusBackground = (status) => {
    switch (status?.toLowerCase()) {
      case 'on time': return 'rgba(76, 175, 80, 0.1)';
      case 'boarding': return 'rgba(33, 150, 243, 0.1)';
      case 'final call': return 'rgba(255, 152, 0, 0.1)';
      case 'gate closed': return 'rgba(244, 67, 54, 0.1)';
      case 'delayed': return 'rgba(255, 152, 0, 0.1)';
      case 'cancelled': return 'rgba(244, 67, 54, 0.1)';
      case 'departed': return 'rgba(156, 39, 176, 0.1)';
      default: return 'rgba(255, 198, 0, 0.1)';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f1114',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          fontSize: '2rem',
          color: '#ffc600'
        }}>
          Loading flight status...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f1114',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          fontSize: '2rem',
          color: '#ff4b3e'
        }}>
          {error}
        </div>
        <div style={{
          fontSize: '1.2rem',
          color: '#ccc'
        }}>
          Flight: {flightNumber}
        </div>
      </div>
    );
  }

  // Get airline logo similar to DeparturesBoard
  const getAirlineLogo = (airlineName) => {
    if (!airlineName) return null;

    const name = airlineName.toLowerCase();

    // This would need the actual logo imports, for now return placeholder
    // You can import the airline logos from DeparturesBoard component
    return null;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Blue Header Area for Logo */}
      <div style={{
        background: 'linear-gradient(135deg, #4169E1, #1E90FF)',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Airline Logo Area */}
        <div style={{
          position: 'absolute',
          left: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {getAirlineLogo(flightData?.Airline) ? (
            <img
              src={getAirlineLogo(flightData?.Airline)}
              alt={flightData?.Airline}
              style={{
                height: '60px',
                objectFit: 'contain'
              }}
            />
          ) : (
            <div style={{
              width: '100px',
              height: '60px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#fff'
            }}>
              AIRLINE LOGO
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        backgroundColor: '#000'
      }}>
        {/* Left Panel - Destination & Time */}
        <div style={{
          flex: '1',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Destination */}
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#FFC600',
            marginBottom: '20px',
            letterSpacing: '2px'
          }}>
            {flightData?.Destination || 'Destination'}
          </div>

          {/* Departure Time */}
          <div style={{
            fontSize: '6rem',
            fontWeight: 'bold',
            color: '#87CEEB',
            fontFamily: 'monospace'
          }}>
            {formatDateTime(flightData?.ScheduledDeparture)}
          </div>
        </div>

        {/* Center Panel - Status Message */}
        <div style={{
          flex: '1.5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div style={{
            textAlign: 'center'
          }}>
            {/* Flight Status */}
            <div style={{
              fontSize: '5rem',
              fontWeight: 'bold',
              color: getStatusColor(flightData?.Status),
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '3px'
            }}>
              {flightData?.Status === 'On Time' ? 'Take a seat' : flightData?.Status?.toUpperCase() || 'BOARDING'}
            </div>

            {/* Additional Info */}
            {flightData?.DelayMinutes > 0 && (
              <div style={{
                fontSize: '2rem',
                color: '#FF9800',
                marginTop: '20px'
              }}>
                Delayed by {flightData.DelayMinutes} minutes
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Flight Info & Advertisement */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Flight Number & Gate */}
          <div style={{
            padding: '40px',
            textAlign: 'right'
          }}>
            {/* Flight Number */}
            <div style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '20px',
              letterSpacing: '2px'
            }}>
              {flightData?.FlightNumber}
            </div>

            {/* Gate */}
            <div style={{
              fontSize: '1.5rem',
              color: '#ccc',
              marginBottom: '10px'
            }}>
              Gate {flightData?.Gate || 'TBA'}
            </div>

            {/* Current Time */}
            <div style={{
              fontSize: '2rem',
              color: '#87CEEB',
              fontFamily: 'monospace'
            }}>
              {formatTime(currentTime)}
            </div>
          </div>

          {/* Advertisement Space */}
          <div style={{
            flex: 1,
            margin: '20px',
            backgroundColor: '#1a1a1a',
            borderRadius: '10px',
            border: '2px solid #333',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '200px'
          }}>
            {/* Ad Header */}
            <div style={{
              backgroundColor: '#333',
              color: '#fff',
              padding: '8px 15px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '8px 8px 0 0'
            }}>
              ADVERTISEMENT
            </div>

            {/* Ad Content Area */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '20px',
              gap: '10px'
            }}>
              {/* Video Ad Area */}
              <div style={{
                width: '100%',
                height: '150px',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px'
              }}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                >
                  <source src="/sample-ad.mp4" type="video/mp4" />
                </video>
              </div>

              {/* QR Code */}
              <div style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '10px',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  SCAN QR CODE
                </div>
                <img
                  src="/QR-New.jpeg"
                  alt="QR Code"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GateStatus;
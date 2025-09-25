import { useState, useEffect } from 'react';

function FlightInfo() {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(true);

  const API_BASE_URL = 'https://testthdsupplierportal.thdmail.net:8091/Users/GetFlightByNumber';

  const searchFlight = async () => {
    if (!flightNumber.trim()) {
      setError('Please enter a flight number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}?flightNumber=${encodeURIComponent(flightNumber.trim())}`);
      const data = await response.json();

      if (data.JsonData) {
        setFlightData(data.JsonData);
        setShowSearch(false);
        startRealTimeUpdates();
      } else {
        setError('Flight not found');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startRealTimeUpdates = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}?flightNumber=${encodeURIComponent(flightNumber.trim())}`);
        const data = await response.json();

        if (data.JsonData) {
          setFlightData(data.JsonData);
        }
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  };

  useEffect(() => {
    let cleanup;
    if (flightData && !showSearch) {
      cleanup = startRealTimeUpdates();
    }
    return cleanup;
  }, [flightData, showSearch, flightNumber]);

  const resetSearch = () => {
    setShowSearch(true);
    setFlightData(null);
    setFlightNumber('');
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchFlight();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'on time': return '#4CAF50';
      case 'delayed': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'boarding': return '#2196F3';
      case 'departed': return '#9C27B0';
      default: return '#666';
    }
  };

  if (showSearch) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          paddingTop: '100px'
        }}>

          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #444'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '1.1rem',
              color: '#ffc600'
            }}>
              Enter Flight Number:
            </label>

            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., AA1234, BA567"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1.2rem',
                border: '2px solid #444',
                borderRadius: '5px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                marginBottom: '20px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ffc600'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />

            <button
              onClick={searchFlight}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1.1rem',
                backgroundColor: loading ? '#666' : '#ffc600',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#ffdd33')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#ffc600')}
            >
              {loading ? 'Searching...' : 'Search Flight'}
            </button>

            {error && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f44336',
                color: '#fff',
                borderRadius: '5px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #ffc600'
        }}>
          <h1 style={{
            fontSize: '1.8rem',
            margin: 0,
            color: '#ffc600'
          }}>✈️ {flightData?.FlightNumber}</h1>

          <button
            onClick={resetSearch}
            style={{
              padding: '8px 15px',
              backgroundColor: 'transparent',
              color: '#ffc600',
              border: '1px solid #ffc600',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            New Search
          </button>
        </div>

        {/* Flight Details */}
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #444',
          marginBottom: '20px'
        }}>
          {/* Status */}
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: getStatusColor(flightData?.Status),
              marginBottom: '5px'
            }}>
              {flightData?.Status || 'Unknown'}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#ccc'
            }}>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Route */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px'
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc600' }}>
                {flightData?.Origin || 'N/A'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '5px' }}>
                FROM ({flightData?.OriginCode})
              </div>
            </div>

            <div style={{
              fontSize: '2rem',
              margin: '0 20px',
              color: '#ffc600'
            }}>
              ✈
            </div>

            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc600' }}>
                {flightData?.Destination || 'N/A'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '5px' }}>
                TO ({flightData?.DestinationCode})
              </div>
            </div>
          </div>

          {/* Time Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '5px' }}>
                DEPARTURE
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                {flightData?.ScheduledDeparture ? new Date(flightData.ScheduledDeparture).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) : 'N/A'}
              </div>
            </div>

            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '5px' }}>
                GATE
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                {flightData?.Gate || 'TBA'}
              </div>
            </div>
          </div>

          {/* Additional Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '5px' }}>
                AIRLINE
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {flightData?.Airline || 'N/A'}
              </div>
            </div>

            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '5px' }}>
                TERMINAL
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {flightData?.Terminal || 'N/A'}
              </div>
            </div>
          </div>

          {/* Delay Information */}
          {flightData?.DelayMinutes > 0 && (
            <div style={{
              backgroundColor: '#FF9800',
              color: '#000',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              ⚠️ Delayed by {flightData.DelayMinutes} minutes
            </div>
          )}

          {/* Aircraft & Arrival Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '5px' }}>
                AIRCRAFT
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {flightData?.Aircraft || 'N/A'}
              </div>
            </div>

            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '5px' }}>
                ARRIVAL
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {flightData?.ScheduledArrival ? new Date(flightData.ScheduledArrival).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FlightInfo;
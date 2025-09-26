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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f1114',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffc600',
        color: '#000',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          margin: 0,
          fontWeight: 'bold'
        }}>
          GATE STATUS
        </h1>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center'
      }}>
        {/* Flight Number */}
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#ffc600',
          marginBottom: '20px',
          letterSpacing: '2px'
        }}>
          {flightData?.FlightNumber}
        </div>

        {/* Route */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          marginBottom: '40px',
          fontSize: '2rem',
          color: '#fff'
        }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>{flightData?.Origin}</div>
            <div style={{ fontSize: '1rem', color: '#ccc' }}>({flightData?.OriginCode})</div>
          </div>
          <div style={{ fontSize: '3rem', color: '#ffc600' }}>✈</div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{flightData?.Destination}</div>
            <div style={{ fontSize: '1rem', color: '#ccc' }}>({flightData?.DestinationCode})</div>
          </div>
        </div>

        {/* Flight Status - Large Centered */}
        <div style={{
          backgroundColor: getStatusBackground(flightData?.Status),
          border: `3px solid ${getStatusColor(flightData?.Status)}`,
          borderRadius: '20px',
          padding: '60px 80px',
          marginBottom: '40px',
          minWidth: '400px'
        }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: getStatusColor(flightData?.Status),
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>
            {flightData?.Status || 'UNKNOWN'}
          </div>
        </div>

        {/* Flight Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          width: '100%',
          maxWidth: '800px'
        }}>
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid #ffc600'
          }}>
            <div style={{
              fontSize: '1rem',
              color: '#ffc600',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              DEPARTURE
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {formatDateTime(flightData?.ScheduledDeparture)}
            </div>
          </div>

          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid #ffc600'
          }}>
            <div style={{
              fontSize: '1rem',
              color: '#ffc600',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              GATE
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {flightData?.Gate || 'TBA'}
            </div>
          </div>

          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid #ffc600'
          }}>
            <div style={{
              fontSize: '1rem',
              color: '#ffc600',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              TERMINAL
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {flightData?.Terminal || 'N/A'}
            </div>
          </div>

          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid #ffc600'
          }}>
            <div style={{
              fontSize: '1rem',
              color: '#ffc600',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              AIRLINE
            </div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              {flightData?.Airline?.toUpperCase() || 'N/A'}
            </div>
          </div>
        </div>

        {/* Delay Information */}
        {flightData?.DelayMinutes > 0 && (
          <div style={{
            marginTop: '40px',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            border: '2px solid #FF9800',
            borderRadius: '15px',
            padding: '30px 50px',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#FF9800'
          }}>
            ⚠️ DELAYED BY {flightData.DelayMinutes} MINUTES
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: '#1a1a1a',
        padding: '15px',
        textAlign: 'center',
        color: '#666',
        borderTop: '1px solid #333'
      }}>
        Updates every 30 seconds • Flight: {flightData?.FlightNumber}
      </div>
    </div>
  );
}

export default GateStatus;
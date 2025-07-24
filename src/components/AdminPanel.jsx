import { useState } from 'react';

function AdminPanel() {
  const [deviceIP, setDeviceIP] = useState('');
  const [targetPage, setTargetPage] = useState('departures');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);

  const baseURL = 'https://fids-two.vercel.app';
  const apiURL = 'http://127.0.0.1:8000/'; // Local Python API URL
  
  const availablePages = [
    { value: 'departures', label: 'Departures Board', description: 'Airport flight departures display' },
    { value: 'admin', label: 'Admin Panel', description: 'Device control panel' }
  ];

  const addLogEntry = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newEntry = {
      id: Date.now(),
      timestamp,
      message,
      type
    };
    setExecutionLog(prev => [newEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
  };

  const executeADBCommand = async () => {
    if (!deviceIP.trim()) {
      addLogEntry('Error: Device IP address is required', 'error');
      return;
    }

    if (!targetPage.trim()) {
      addLogEntry('Error: Target page is required', 'error');
      return;
    }

    setIsExecuting(true);
    addLogEntry(`Executing ADB command for device ${deviceIP}...`, 'info');

    try {
      const response = await fetch(`${apiURL}/api/execute-adb`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceIP: deviceIP,
          targetPage: targetPage,
          baseURL: baseURL
        })
      });

      const result = await response.json();

      if (result.success) {
        addLogEntry(`✅ ${result.message}`, 'success');
        addLogEntry(`Command: ${result.command}`, 'command');
        if (result.output) {
          addLogEntry(`Output: ${result.output}`, 'info');
        }
        
        // Add device to connected devices list if not already present
        if (!connectedDevices.some(device => device.ip === deviceIP)) {
          const newDevice = {
            ip: deviceIP,
            lastPage: targetPage,
            lastUpdate: new Date().toLocaleString(),
            status: 'connected'
          };
          setConnectedDevices(prev => [...prev, newDevice]);
        } else {
          // Update existing device
          setConnectedDevices(prev => 
            prev.map(device => 
              device.ip === deviceIP 
                ? { ...device, lastPage: targetPage, lastUpdate: new Date().toLocaleString(), status: 'connected' }
                : device
            )
          );
        }
        
      } else {
        addLogEntry(`❌ ${result.message || 'Command execution failed'}`, 'error');
        addLogEntry(`Command: ${result.command}`, 'command');
        if (result.error) {
          addLogEntry(`Error: ${result.error}`, 'error');
        }
        
        // Update device status to error
        setConnectedDevices(prev => 
          prev.map(device => 
            device.ip === deviceIP 
              ? { ...device, status: 'error', lastUpdate: new Date().toLocaleString() }
              : device
          )
        );
      }
      
    } catch (error) {
      addLogEntry(`❌ Network error: ${error.message}`, 'error');
      addLogEntry('Make sure the Python API server is running', 'warning');
      
      // Update device status to offline
      setConnectedDevices(prev => 
        prev.map(device => 
          device.ip === deviceIP 
            ? { ...device, status: 'offline', lastUpdate: new Date().toLocaleString() }
            : device
        )
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const clearLog = () => {
    setExecutionLog([]);
    addLogEntry('Execution log cleared', 'info');
  };

  const removeDevice = (ip) => {
    setConnectedDevices(prev => prev.filter(device => device.ip !== ip));
    addLogEntry(`Device ${ip} removed from list`, 'info');
  };

  const quickLoadPage = (device, page) => {
    setDeviceIP(device.ip);
    setTargetPage(page);
    setTimeout(() => executeADBCommand(), 100);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🖥️ FIDS Admin Panel</h1>
        <p>Control remote devices and manage display pages</p>
      </div>

      <div className="admin-content">
        {/* Device Control Panel */}
        <div className="control-panel">
          <h2>Device Control</h2>
          
          <div className="input-group">
            <label htmlFor="deviceIP">Device IP Address:</label>
            <input
              type="text"
              id="deviceIP"
              value={deviceIP}
              onChange={(e) => setDeviceIP(e.target.value)}
              placeholder="e.g., 192.168.1.100"
              className="ip-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="targetPage">Target Page:</label>
            <select
              id="targetPage"
              value={targetPage}
              onChange={(e) => setTargetPage(e.target.value)}
              className="page-select"
            >
              {availablePages.map(page => (
                <option key={page.value} value={page.value}>
                  {page.label} - {page.description}
                </option>
              ))}
            </select>
          </div>

          <div className="url-preview">
            <strong>Target URL:</strong> {baseURL}/{targetPage}
          </div>

          <button
            onClick={executeADBCommand}
            disabled={isExecuting || !deviceIP.trim()}
            className={`execute-btn ${isExecuting ? 'executing' : ''}`}
          >
            {isExecuting ? '⏳ Executing...' : '🚀 Activate Device'}
          </button>
        </div>

        {/* Connected Devices */}
        <div className="devices-panel">
          <h2>Connected Devices ({connectedDevices.length})</h2>
          {connectedDevices.length === 0 ? (
            <p className="no-devices">No devices connected yet</p>
          ) : (
            <div className="devices-list">
              {connectedDevices.map(device => (
                <div key={device.ip} className="device-card">
                  <div className="device-info">
                    <h3>📱 {device.ip}</h3>
                    <p><strong>Current Page:</strong> {device.lastPage}</p>
                    <p><strong>Last Update:</strong> {device.lastUpdate}</p>
                    <span className={`status ${device.status}`}>{device.status}</span>
                  </div>
                  <div className="device-actions">
                    {availablePages.map(page => (
                      <button
                        key={page.value}
                        onClick={() => quickLoadPage(device, page.value)}
                        className="quick-action-btn"
                        title={`Load ${page.label} on this device`}
                      >
                        {page.label}
                      </button>
                    ))}
                    <button
                      onClick={() => removeDevice(device.ip)}
                      className="remove-btn"
                      title="Remove device"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Execution Log */}
        <div className="log-panel">
          <div className="log-header">
            <h2>Execution Log</h2>
            <button onClick={clearLog} className="clear-log-btn">🗑️ Clear Log</button>
          </div>
          <div className="log-content">
            {executionLog.length === 0 ? (
              <p className="no-logs">No execution logs yet</p>
            ) : (
              executionLog.map(entry => (
                <div key={entry.id} className={`log-entry ${entry.type}`}>
                  <span className="log-time">[{entry.timestamp}]</span>
                  <span className="log-message">{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
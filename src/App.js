import React, { useState } from 'react';

function App() {
  const [devices, setDevices] = useState([]);
  const [message, setMessage] = useState('');

  const listDevices = async () => {
    try {
      const devices = await navigator.usb.getDevices();
      setDevices(devices);
      setMessage(`Found ${devices.length} devices`);
    } catch (error) {
      console.error('Error listing devices:', error);
      setMessage('Failed to list devices');
    }
  };

  const connectDevice = async () => {
    try {
      const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] }); // Adjust the vendorId as necessary
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      setMessage('Device connected');
    } catch (error) {
      console.error('Error connecting to device:', error);
      setMessage('Failed to connect to device');
    }
  };

  const flashFirmware = async () => {
    try {
      const response = await fetch('/firmware');
      const firmware = await response.arrayBuffer();

      const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] }); // Adjust the vendorId as necessary
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      const data = new Uint8Array(firmware);
      await device.transferOut(1, data); // Adjust endpoint number as necessary
      setMessage('Firmware flashed successfully');
    } catch (error) {
      console.error('Error flashing firmware:', error);
      setMessage('Failed to flash firmware');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flash Firmware to Device</h1>
        <button onClick={listDevices}>List Devices</button>
        <button onClick={connectDevice}>Connect Device</button>
        <button onClick={flashFirmware}>Flash Firmware</button>
        <p>{message}</p>
        <ul>
          {devices.map((device, index) => (
            <li key={index}>{device.productName} (Vendor ID: {device.vendorId}, Product ID: {device.productId})</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;

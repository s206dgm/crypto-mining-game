import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Header from './Header';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main className="main-content">
        <div className="device-table">
          <div className="device-table-header">
            <div>Devices</div>
            <button>Connect a Device</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Configuration</th>
                <th>Labels</th>
                <th>Type</th>
                <th>Status</th>
                <th>Hardware</th>
                <th>Hash rate</th>
                <th>Temperature</th>
                <th>Power usage</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mining01</td>
                <td>Custom configuration</td>
                <td>Home</td>
                <td>Running</td>
                <td>---</td>
                <td>25.04 g/s</td>
                <td>69°C</td>
                <td>1.01 kW</td>
                <td>1 minute ago</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default App;

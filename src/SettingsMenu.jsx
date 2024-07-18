import React from 'react';
import './SettingsMenu.css';

const SettingsMenu = ({ active }) => {
  return (
    <div className={`settings-menu ${active ? 'active' : ''}`}>
      <ul>
        <li>Profile</li>
        <li>Account</li>
        <li>Preferences</li>
        <li>Logout</li>
      </ul>
    </div>
  );
};

export default SettingsMenu;

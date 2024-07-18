import React, { useState, useEffect } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import SettingsMenu from './SettingsMenu';

const Header = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [settingsActive, setSettingsActive] = useState(false);

  const toggleSearch = () => {
    setSearchActive(!searchActive);
  };

  const toggleSettings = () => {
    setSettingsActive(!settingsActive);
  };

  const closeSettings = () => {
    setSettingsActive(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsActive && !event.target.closest('.settings-container') && !event.target.closest('.settings-icon')) {
        closeSettings();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsActive]);

  return (
    <header className="header">
      <div className="logo">Rykai Miner</div>
      <div className="header-icons">
        <div className={`search-container ${searchActive ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={toggleSearch} />
          <input type="text" className="search-input" placeholder="Search..." />
        </div>
        <div className="settings-container">
          <FontAwesomeIcon icon={faCog} className={`settings-icon ${settingsActive ? 'rotate' : ''}`} onClick={toggleSettings} />
          <SettingsMenu active={settingsActive} />
        </div>
      </div>
    </header>
  );
};

export default Header;

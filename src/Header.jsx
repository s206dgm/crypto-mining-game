import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faWallet } from '@fortawesome/free-solid-svg-icons';

function Header({ theme, toggleTheme, wallet, cryptocurrencies }) {
  return (
    <header className="App-header">
      <div className="header-left">
        <h1>Crypto Mining Simulator</h1>
      </div>
      <div className="header-center">
        {cryptocurrencies.map(crypto => (
          <div key={crypto.name} className="crypto-info">
            <span>{crypto.name}: ${crypto.marketRate}</span>
            <span>Optimal Mining Rate: {crypto.minHashRate}/s</span>
          </div>
        ))}
      </div>
      <div className="header-right">
        <div className="wallet-info">
          <FontAwesomeIcon icon={faWallet} />
          <span>${wallet.toFixed(2)}</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
        </button>
      </div>
    </header>
  );
}

export default Header;
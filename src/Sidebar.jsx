import React, { useState } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWallet, faDesktop, faShoppingCart, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [showDevices, setShowDevices] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const [showShopping, setShowShopping] = useState(false);

  return (
    <aside className="sidebar">
      <ul>
        <li className="home">
          <FontAwesomeIcon icon={faHome} /> <span>Home</span>
        </li>
        <hr />
        <li onClick={() => setShowDevices(!showDevices)}>
          <FontAwesomeIcon icon={faDesktop} /> <span>Devices</span> 
          <FontAwesomeIcon icon={showDevices ? faChevronUp : faChevronDown} className="chevron" />
        </li>
        <ul className={`dropdown ${showDevices ? 'active' : ''}`}>
          <li><span>Configurations</span></li>
          <li><span>Gateways</span></li>
          <li><span>Labels</span></li>
        </ul>
        <li onClick={() => setShowWallets(!showWallets)}>
          <FontAwesomeIcon icon={faWallet} /> <span>Wallets</span> 
          <FontAwesomeIcon icon={showWallets ? faChevronUp : faChevronDown} className="chevron" />
        </li>
        <ul className={`dropdown ${showWallets ? 'active' : ''}`}>
          <li><span>Transactions</span></li>
          <li><span>Balances</span></li>
        </ul>
        <li onClick={() => setShowShopping(!showShopping)}>
          <FontAwesomeIcon icon={faShoppingCart} /> <span>Shopping</span> 
          <FontAwesomeIcon icon={showShopping ? faChevronUp : faChevronDown} className="chevron" />
        </li>
        <ul className={`dropdown ${showShopping ? 'active' : ''}`}>
          <li><span>Parts</span></li>
          <li><span>Discounts</span></li>
        </ul>
      </ul>
    </aside>
  );
};

export default Sidebar;

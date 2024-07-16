import React, { useState, useEffect } from 'react';
import './App.css';
import minerImage from './assets/miner.png';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faTimesCircle, faWallet, faTools, faShoppingCart, faPlus } from '@fortawesome/free-solid-svg-icons';

const MINER_TYPES = [
  { name: 'Basic', price: 500, hashRate: 1, powerConsumption: 100, idealCoin: 'Litecoin' },
  { name: 'Advanced', price: 1500, hashRate: 3, powerConsumption: 250, idealCoin: 'Ethereum' },
  { name: 'Pro', price: 5000, hashRate: 10, powerConsumption: 500, idealCoin: 'Bitcoin' }
];

const CRYPTOCURRENCIES = [
  { name: 'Bitcoin', minHashRate: 5, price: 10000, marketRate: 30000 },
  { name: 'Ethereum', minHashRate: 2, price: 300, marketRate: 2000 },
  { name: 'Litecoin', minHashRate: 0.5, price: 50, marketRate: 100 }
];

const SELL_FEE = 0.05; // 5% fee
const SALES_TAX = 0.06; // 6% sales tax
const HEALTH_CHANGE_PROBABILITY = 0.001; // 0.1% chance every second
const MINING_RATE_FACTOR = 0.0001; // Slower mining rate

function App() {
  const [wallet, setWallet] = useState(10000);
  const [farms, setFarms] = useState([
    { 
      miners: [
        { type: MINER_TYPES[0], health: 'healthy' },
      ],
      crypto: 0,
      cryptoType: CRYPTOCURRENCIES[0]
    }
  ]);
  const [theme, setTheme] = useState('dark');
  const [showMinerOptions, setShowMinerOptions] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showSellCryptoModal, setShowSellCryptoModal] = useState(false);
  const [sellingFarm, setSellingFarm] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showBulkFixModal, setShowBulkFixModal] = useState(false);
  const [bulkFixingFarm, setBulkFixingFarm] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setFarms(prevFarms => prevFarms.map(farm => ({
        ...farm,
        crypto: farm.crypto + calculateMiningRate(farm),
        miners: farm.miners.map(miner => {
          if (Math.random() < HEALTH_CHANGE_PROBABILITY) {
            const healthStates = ['healthy', 'needsAttention', 'dead'];
            const currentIndex = healthStates.indexOf(miner.health);
            const newIndex = Math.min(currentIndex + 1, 2);
            return { ...miner, health: healthStates[newIndex] };
          }
          return miner;
        })
      })));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateMiningRate = (farm) => {
    return farm.miners.reduce((acc, miner) => {
      const efficiency = miner.type.idealCoin === farm.cryptoType.name ? 1 : 0.5;
      const healthFactor = miner.health === 'healthy' ? 1 : miner.health === 'needsAttention' ? 0.5 : 0;
      return acc + (miner.type.hashRate * efficiency * healthFactor * MINING_RATE_FACTOR);
    }, 0);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const addToCart = (minerType, quantity) => {
    const existingItemIndex = cart.findIndex(item => item.type.name === minerType.name);
    if (existingItemIndex !== -1) {
      setCart(prevCart => prevCart.map((item, index) => 
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart(prevCart => [...prevCart, { type: minerType, quantity }]);
    }
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index, newQuantity) => {
    setCart(prevCart => prevCart.map((item, i) => 
      i === index ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ));
  };

  const checkout = () => {
    const subtotal = cart.reduce((total, item) => total + item.type.price * item.quantity, 0);
    const tax = subtotal * SALES_TAX;
    const totalCost = subtotal + tax;
    if (wallet >= totalCost) {
      setWallet(prevWallet => prevWallet - totalCost);
      setFarms(prevFarms => prevFarms.map((farm, index) => 
        index === selectedFarm 
          ? { 
              ...farm, 
              miners: [
                ...farm.miners, 
                ...cart.flatMap(item => 
                  Array(item.quantity).fill({ type: item.type, health: 'healthy' })
                )
              ] 
            } 
          : farm
      ));
      setCart([]);
      setShowCheckout(false);
      setShowMinerOptions(false);
    } else {
      alert("Not enough funds to complete the purchase.");
    }
  };

  const sellCrypto = (farmIndex) => {
    const farm = farms[farmIndex];
    const grossProfit = farm.crypto * farm.cryptoType.marketRate;
    const fee = grossProfit * SELL_FEE;
    const netProfit = grossProfit - fee;

    setShowSellCryptoModal(true);
    setSellingFarm({
      index: farmIndex,
      crypto: farm.crypto,
      cryptoType: farm.cryptoType,
      grossProfit,
      fee,
      netProfit
    });
  };

  const confirmSellCrypto = () => {
    setWallet(prevWallet => prevWallet + sellingFarm.netProfit);
    setFarms(prevFarms => prevFarms.map((farm, index) => 
      index === sellingFarm.index ? { ...farm, crypto: 0 } : farm
    ));
    setShowSellCryptoModal(false);
    setSellingFarm(null);
  };

  const addNewFarm = () => {
    setFarms(prevFarms => [
      ...prevFarms,
      {
        miners: [],
        crypto: 0,
        cryptoType: CRYPTOCURRENCIES[0]
      }
    ]);
  };

  const changeCrypto = (farmIndex, crypto) => {
    setFarms(prevFarms => prevFarms.map((farm, index) => 
      index === farmIndex ? { ...farm, cryptoType: crypto, crypto: 0 } : farm
    ));
  };

  const fixMiner = (farmIndex, minerIndex) => {
    const repairCost = 100; // Set a repair cost
    if (wallet >= repairCost) {
      setWallet(prevWallet => prevWallet - repairCost);
      setFarms(prevFarms => prevFarms.map((farm, fIndex) => 
        fIndex === farmIndex 
          ? {
              ...farm,
              miners: farm.miners.map((miner, mIndex) => 
                mIndex === minerIndex ? { ...miner, health: 'healthy' } : miner
              )
            }
          : farm
      ));
    }
  };

  const bulkFix = (farmIndex, health) => {
    const farm = farms[farmIndex];
    const minersToFix = farm.miners.filter(miner => miner.health === health);
    const repairCost = minersToFix.length * 100; // 100 per miner

    if (wallet >= repairCost) {
      setWallet(prevWallet => prevWallet - repairCost);
      setFarms(prevFarms => prevFarms.map((farm, fIndex) => 
        fIndex === farmIndex 
          ? {
              ...farm,
              miners: farm.miners.map(miner => 
                miner.health === health ? { ...miner, health: 'healthy' } : miner
              )
            }
          : farm
      ));
    } else {
      alert("Not enough funds to repair all miners.");
    }
    setShowBulkFixModal(false);
    setBulkFixingFarm(null);
  };

  return (
    <div className={`App ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} wallet={wallet} cryptocurrencies={CRYPTOCURRENCIES} />
      <main className="App-main">
        <button className="add-farm-button" onClick={addNewFarm}>
          <FontAwesomeIcon icon={faPlus} /> Add New Farm
        </button>
        {farms.map((farm, index) => (
          <section key={index} className="farm">
            <div className="farm-header">
              <h2>Mining Farm {index + 1} - {farm.cryptoType.name}</h2>
              <div className="farm-stats">
                <span>Earned: ${(farm.crypto * farm.cryptoType.marketRate).toFixed(2)}</span>
                <span>
                  <FontAwesomeIcon icon={faCheckCircle} className="health-icon healthy" /> 
                  {farm.miners.filter(m => m.health === 'healthy').length}
                </span>
                <span>
                  <FontAwesomeIcon icon={faExclamationCircle} className="health-icon needs-attention" /> 
                  {farm.miners.filter(m => m.health === 'needsAttention').length}
                </span>
                <span>
                  <FontAwesomeIcon icon={faTimesCircle} className="health-icon dead" /> 
                  {farm.miners.filter(m => m.health === 'dead').length}
                </span>
                <span>Total Miners: {farm.miners.length}</span>
              </div>
            </div>
            <div className="actions">
              <button onClick={() => { setShowMinerOptions(true); setSelectedFarm(index); }}>Buy Miner</button>
              <button onClick={() => sellCrypto(index)}>Sell Crypto</button>
              <button onClick={() => { setShowBulkFixModal(true); setBulkFixingFarm(index); }}>Bulk Fix</button>
            </div>
            <select onChange={(e) => changeCrypto(index, CRYPTOCURRENCIES.find(c => c.name === e.target.value))}>
              {CRYPTOCURRENCIES.map(crypto => (
                <option key={crypto.name} value={crypto.name}>{crypto.name}</option>
              ))}
            </select>
            <div className="miners-container">
              {farm.miners.map((miner, minerIndex) => (
                <div key={minerIndex} className="miner-wrapper">
                  <img src={minerImage} alt="Miner" className="miner-icon" />
                  <FontAwesomeIcon 
                    icon={miner.health === 'healthy' ? faCheckCircle : miner.health === 'needsAttention' ? faExclamationCircle : faTimesCircle} 
                    className={`health-icon ${miner.health}`} 
                  />
                  <div className="miner-tooltip">
                    <p>Type: {miner.type.name}</p>
                    <p>Hash Rate: {miner.type.hashRate}</p>
                    <p>Power: {miner.type.powerConsumption}W</p>
                    <p>Status: {miner.health}</p>
                    <p>Ideal for: {miner.type.idealCoin}</p>
                    {miner.health !== 'healthy' && (
                      <button onClick={() => fixMiner(index, minerIndex)}>
                        <FontAwesomeIcon icon={faTools} /> Fix ($100)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
      {showMinerOptions && (
        <div className="modal">
          <div className="modal-content">
            <h3>Choose Miners to Buy</h3>
            <table className="miner-options">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Hash Rate</th>
                  <th>Power</th>
                  <th>Ideal Coin</th>
                  <th>Quantity</th>
                  <th>Add to Cart</th>
                </tr>
              </thead>
              <tbody>
                {MINER_TYPES.map((miner, index) => (
                  <tr key={index}>
                    <td>{miner.name}</td>
                    <td>${miner.price}</td>
                    <td>{miner.hashRate}</td>
                    <td>{miner.powerConsumption}W</td>
                    <td>{miner.idealCoin}</td>
                    <td>
                      <input 
                        type="number" 
                        min="0" 
                        defaultValue="0"
                        onChange={(e) => e.target.value = Math.max(0, parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td>
                      <button onClick={() => addToCart(miner, parseInt(e.target.value) || 0)}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Items in cart: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
            <div className="cart-actions">
              <button onClick={() => setShowCheckout(true)}>Checkout</button>
              <button onClick={() => { setShowMinerOptions(false); setCart([]); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showCheckout && (
        <div className="modal">
          <div className="modal-content">
            <h3>Checkout</h3>
            <table className="checkout-summary">
              <thead>
                <tr>
                  <th>Miner Type</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.type.name}</td>
                    <td>
                      <input 
type="number" 
value={item.quantity} 
onChange={(e) => updateCartQuantity(index, parseInt(e.target.value) || 0)}
min="0"
/>
</td>
<td>${item.type.price}</td>
<td>${item.type.price * item.quantity}</td>
<td>
<button onClick={() => removeFromCart(index)}>Remove</button>
</td>
</tr>
))}
</tbody>
</table>
{cart.length > 0 && (
<>
<p>Subtotal: ${cart.reduce((total, item) => total + item.type.price * item.quantity, 0).toFixed(2)}</p>
<p>Tax (6%): ${(cart.reduce((total, item) => total + item.type.price * item.quantity, 0) * SALES_TAX).toFixed(2)}</p>
<p>Total: ${(cart.reduce((total, item) => total + item.type.price * item.quantity, 0) * (1 + SALES_TAX)).toFixed(2)}</p>
</>
)}
<div className="checkout-actions">
<button onClick={checkout}>Confirm Purchase</button>
<button onClick={() => setShowCheckout(false)}>Back to Cart</button>
</div>
</div>
</div>
)}
{showSellCryptoModal && sellingFarm && (
<div className="modal">
<div className="modal-content">
<h3>Sell Crypto Confirmation</h3>
<p>Coin: {sellingFarm.cryptoType.name}</p>
<p>Amount: {sellingFarm.crypto.toFixed(6)}</p>
<p>Market Rate: ${sellingFarm.cryptoType.marketRate}</p>
<p>Gross Value: ${sellingFarm.grossProfit.toFixed(2)}</p>
<p>Fee ({SELL_FEE * 100}%): ${sellingFarm.fee.toFixed(2)}</p>
<p>Net Earnings: ${sellingFarm.netProfit.toFixed(2)}</p>
<div className="sell-actions">
<button onClick={confirmSellCrypto}>Confirm Sale</button>
<button onClick={() => setShowSellCryptoModal(false)}>Cancel</button>
</div>
</div>
</div>
)}
{showBulkFixModal && bulkFixingFarm !== null && (
<div className="modal">
<div className="modal-content">
<h3>Bulk Fix Miners</h3>
<p>Choose which miners to fix:</p>
<button onClick={() => bulkFix(bulkFixingFarm, 'needsAttention')}>
Fix All Needs Attention (${farms[bulkFixingFarm].miners.filter(m => m.health === 'needsAttention').length * 100})
</button>
<button onClick={() => bulkFix(bulkFixingFarm, 'dead')}>
Fix All Dead (${farms[bulkFixingFarm].miners.filter(m => m.health === 'dead').length * 100})
</button>
<button onClick={() => setShowBulkFixModal(false)}>Cancel</button>
</div>
</div>
)}
</div>
);
}

export default App;
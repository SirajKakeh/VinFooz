/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from 'react';
import Barcode from 'react-barcode';
import './App.css';
import winfooz128 from './images/winfooz128.png';
import spinner from './images/spinner.svg';

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [vin, setVin] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    chrome.storage.sync.get('storageVin', ({ storageVin }) => {
      if (storageVin) {
        setVin(storageVin);
      }
    });
  }, []);

  const copyVin = () => {
    inputRef.current.select();
    document.execCommand('copy');
  };

  const getVin = (type = 'fake') => {
    if (isLoading) return;
    setIsLoading(true);
    fetch(`${proxyUrl}http://randomvin.com/getvin.php?type=${type}`)
      .then(res => res.text())
      .then(vin => {
        setVin(vin);
        setIsLoading(false);
        copyVin();
        chrome.storage.sync.set({ storageVin: vin });
      })
      .catch(console.error);
  };

  return (
    <div className="container">
      <div className="background-pics">
        <img src={winfooz128} alt="logo-neutral" />
        <img src={winfooz128} alt="logo-neutral" />
        <img src={winfooz128} alt="logo-neutral" />
        <img src={winfooz128} alt="logo-neutral" />
      </div>
      <div className="container-inner">
        <button className="action-button" onClick={() => getVin()}>
          <span>Generate & Copy</span>
        </button>
        <div className="controls-wrapper">
          <input value={vin} ref={inputRef} readOnly />
          <div className={`vin-value ${vin ? 'with-vin' : ''}`}>{vin}</div>
        </div>
        {isLoading && <img src={spinner} alt="loading" className="spinner" />}
        {vin && <Barcode value={vin} displayValue={false} height={75} />}
        <span className="footer">
          Developed by &nbsp;
          <a
            href="https://www.linkedin.com/in/siraj-kakeh"
            target="_blank"
            rel="noopener noreferrer"
          >
            Siraj Kakeh
          </a>
          &nbsp; for Winfooz<span>&copy;</span>
        </span>
      </div>
    </div>
  );
}

export default App;

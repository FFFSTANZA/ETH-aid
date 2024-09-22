import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';
import './MainPage.css';  // Ensure this path is correct

function MainPage() {
    const navigate = useNavigate();
    const [walletConnected, setWalletConnected] = useState(false);

    return (
        <div className="main-container">
            <h1 className="main-title">Welcome to ETHaid</h1>
            <ConnectWallet setWalletConnected={setWalletConnected} />
            {walletConnected && (
                <div className="button-container">
                    <button className="main-button" onClick={() => navigate('/donor')}>For Donors</button>
                    <button className="main-button" onClick={() => navigate('/distributor')}>For Distributors</button>
                    <button className="main-button" onClick={() => navigate('/recipient')}>For Aid Receivers</button>
                </div>
            )}
        </div>
    );
}

export default MainPage;

import React, { useState } from 'react';
import Web3 from 'web3';

function ConnectWallet({ setWalletConnected }) {
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                // Standard method to request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                setWalletConnected(true);
            } catch (error) {
                alert('Failed to load MetaMask accounts. Please try again.');
                console.error(error);
            }
        } else {
            alert('Please install MetaMask to interact with this app.');
        }
    };

    return (
        <div>
            <button onClick={connectWallet}>
                {account ? `Connected: ${account}` : 'Connect MetaMask'}
            </button>
        </div>
    );
}

export default ConnectWallet;

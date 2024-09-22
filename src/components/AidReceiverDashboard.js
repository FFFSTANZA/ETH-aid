import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import './styles.css';  // Ensure you import your specific styles

const ContractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "requester",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "AidRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "donationType",
				"type": "string"
			}
		],
		"name": "DonationReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "requester",
				"type": "address"
			}
		],
		"name": "SOSRaised",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "donateETH",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "details",
				"type": "string"
			}
		],
		"name": "donateFood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "fulfillAidRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "raiseSOS",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "requestAid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "aidRequestCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "aidRequests",
		"outputs": [
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "requester",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "fulfilled",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "fetchAidRequest",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "requester",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "fulfilled",
						"type": "bool"
					}
				],
				"internalType": "struct AidManagement.AidRequest",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const ContractAddress = "0x7EC4Aa659e132Ffe56020Ee44a0d66F3972156e4";
function AidReceiverDashboard() {
    const navigate = useNavigate();
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [aidRequestStatus, setAidRequestStatus] = useState('');
    const [sosStatus, setSosStatus] = useState('');

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.enable();
                const accounts = await web3Instance.eth.getAccounts();
                const contractInstance = new web3Instance.eth.Contract(ContractABI, ContractAddress);
                setWeb3(web3Instance);
                setAccounts(accounts);
                setContract(contractInstance);
            } else {
                alert('Please install MetaMask to interact with this app.');
            }
        };
        init();
    }, []);

    const requestAid = async () => {
        if (contract && accounts.length > 0) {
            try {
                const description = prompt("Enter aid description:", "Need food and medical aid");
                if (!description) return;
                await contract.methods.requestAid(description).send({ from: accounts[0] });
                setAidRequestStatus('Aid requested successfully.');
            } catch (error) {
                console.error("Request failed", error);
                setAidRequestStatus('Aid request failed. Please try again.');
            }
        }
    };

    const triggerSOS = async () => {
        if (contract && accounts.length > 0) {
            try {
                await contract.methods.raiseSOS().send({ from: accounts[0] });
                setSosStatus('SOS triggered! Help is on the way.');
            } catch (error) {
                console.error("SOS failed", error);
                setSosStatus('Failed to send SOS. Please try again.');
            }
        }
    };

    return (
        <div className="aid-receiver-dashboard">
            <header>
                <h1>Aid Receiver Dashboard</h1>
                <nav>
                    <button onClick={() => navigate('/')}>Home</button>
                    <button onClick={() => navigate('/contact')}>Contact Us</button>
                </nav>
            </header>

            <section className="aid-request">
                <h2>Request Aid</h2>
                <button onClick={requestAid}>Request Aid</button>
                <p>{aidRequestStatus}</p>
            </section>

            <section className="sos">
                <h2>Medical SOS</h2>
                <button onClick={triggerSOS}>Send SOS</button>
                <p>{sosStatus}</p>
            </section>

            <section className="nearby-camps">
                <h2>Nearby Camps</h2>
                <ul>
                    <li>Camp 1: Location A</li>
                    <li>Camp 2: Location B</li>
                    <li>Camp 3: Location C</li>
                </ul>
            </section>

            <section className="feedback">
                <h2>Submit Feedback</h2>
                <textarea placeholder="Enter your feedback here"></textarea>
                <button>Submit Feedback</button>
            </section>
        </div>
    );
}

export default AidReceiverDashboard;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Chart } from 'react-google-charts';

// Smart Contract ABI and Address
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

function DistributorDashboard() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [aidRequests, setAidRequests] = useState([]);
    const [camps, setCamps] = useState([
        { id: 1, name: "Camp 1", food: 100, medicine: 50, shelters: 20 },
        { id: 2, name: "Camp 2", food: 80, medicine: 30, shelters: 15 },
        { id: 3, name: "Camp 3", food: 50, medicine: 20, shelters: 10 }
    ]);
    const [selectedCamp, setSelectedCamp] = useState(null);
    const [aidType, setAidType] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [lowStockThreshold, setLowStockThreshold] = useState(10);

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
                loadAidRequests(contractInstance);
            } else {
                alert('Please install MetaMask to interact with this app.');
            }
        };
        init();
    }, []);

    const loadAidRequests = async (contract) => {
        try {
            const count = await contract.methods.aidRequestCount().call();
            const requests = [];
            for (let i = 0; i < count; i++) {
                const request = await contract.methods.fetchAidRequest(i).call();
                requests.push(request);
            }
            setAidRequests(requests);
        } catch (error) {
            console.error("Error fetching aid requests", error);
        }
    };

    // Handle distribution of aid
    const distributeAid = () => {
        if (selectedCamp && aidType && quantity > 0) {
            const updatedCamps = camps.map(camp => {
                if (camp.id === selectedCamp.id) {
                    camp[aidType] -= quantity;
                }
                return camp;
            });
            setCamps(updatedCamps);
            alert(`Distributed ${quantity} units of ${aidType} to ${selectedCamp.name}`);
        } else {
            alert("Please select a camp, aid type, and quantity.");
        }
    };

    // Check for low stock
    const checkLowStock = (camp) => {
        return camp.food < lowStockThreshold || camp.medicine < lowStockThreshold || camp.shelters < lowStockThreshold;
    };

    // Render current stock visualization
    const renderStockVisualization = () => {
        const data = [
            ["Camp", "Food", "Medicine", "Shelters"],
            ...camps.map(camp => [camp.name, camp.food, camp.medicine, camp.shelters])
        ];
    
        const options = {
            title: 'Camp Inventory Levels',
            hAxis: { title: 'Camp' },
            vAxis: { title: 'Units' },
            fontName: 'Arial',  // Set a reliable font
            fontSize: 12
        };
    
        return (
            <Chart
                chartType="Bar"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
        );
    };
    

    return (
        <div>
            <h1>Distributor Dashboard</h1>

            {/* Aid Requests */}
            <h2>Aid Requests</h2>
            <ul>
                {aidRequests.map((request, index) => (
                    <li key={index}>
                        Request by {request.requester}: {request.description} (Fulfilled: {request.fulfilled ? 'Yes' : 'No'})
                        {!request.fulfilled && (
                            <button onClick={async () => {
                                try {
                                    await contract.methods.fulfillAidRequest(index).send({ from: accounts[0] });
                                    alert("Aid request fulfilled!");
                                    loadAidRequests(contract);  // Refresh aid requests
                                } catch (error) {
                                    console.error("Failed to fulfill aid request", error);
                                }
                            }}>
                                Mark as Fulfilled
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {/* Distribute Aid */}
            <h2>Distribute Aid</h2>
            <label>Select Camp:</label>
            <select onChange={(e) => setSelectedCamp(camps.find(camp => camp.id === parseInt(e.target.value)))}>
                <option value="">--Select a Camp--</option>
                {camps.map(camp => (
                    <option key={camp.id} value={camp.id}>{camp.name}</option>
                ))}
            </select>
            <br />
            <label>Aid Type:</label>
            <select onChange={(e) => setAidType(e.target.value)}>
                <option value="">--Select Aid Type--</option>
                <option value="food">Food</option>
                <option value="medicine">Medicine</option>
                <option value="shelters">Shelters</option>
            </select>
            <br />
            <label>Quantity:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <br />
            <button onClick={distributeAid}>Distribute</button>

            {/* Current Inventory Visualization */}
            <h2>Inventory Visualization</h2>
            {renderStockVisualization()}

            {/* Low Stock Reminders */}
            <h2>Low Stock Reminders</h2>
            {camps.map(camp => (
                checkLowStock(camp) && (
                    <p key={camp.id} style={{ color: 'red' }}>
                        Low stock alert for {camp.name}: Please restock!
                    </p>
                )
            ))}
        </div>
    );
}

export default DistributorDashboard;

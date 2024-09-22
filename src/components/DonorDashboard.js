import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
    './assets/images/carousel1.jpg',
    './assets/images/carousel2.jpg',
    './assets/images/carousel3.jpg',
    './assets/images/carousel4.jpg'
];

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
const ContractAddress = "0x7EC4Aa659e132Ffe56020Ee44a0d66F3972156e4"; // Ensure this is your correct contract address

function DonorDashboard() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [foodDonation, setFoodDonation] = useState('');
    const [isETH, setIsETH] = useState(true); // Toggle between ETH and food donation

    useEffect(() => {
        const initWeb3 = async () => {
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
        initWeb3();
    }, []);

    const handleDonation = async () => {
        if (!contract || accounts.length === 0) {
            alert("Please connect to MetaMask.");
            return;
        }

        if (isETH && donationAmount) {
            try {
                const response = await contract.methods.donateETH().send({
                    from: accounts[0],
                    value: web3.utils.toWei(donationAmount, 'ether')
                });
                alert("Donation successful!");
            } catch (error) {
                console.error("Donation failed:", error);
                alert("Donation failed. Please try again.");
            }
        } else if (!isETH && foodDonation) {
            try {
                const response = await contract.methods.donateFood(foodDonation).send({ from: accounts[0] });
                alert("Food donation successful!");
            } catch (error) {
                console.error("Donation failed:", error);
                alert("Donation failed. Please try again.");
            }
        } else {
            alert("Please enter a valid donation amount or food item.");
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    };

    return (
        <div className="donor-dashboard">
            <h1>Donate to Support</h1>
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={index}>
                        <img src={img} alt="Every help saves a life " style={{ width: '100%', height: 'auto' }} />
                    </div>
                ))}
            </Slider>
            <p>Your Account: {accounts[0] || "Not Connected"}</p>
            <div>
                <button onClick={() => setIsETH(true)}>Donate ETH</button>
                <button onClick={() => setIsETH(false)}>Donate Food</button>
            </div>
            {isETH ? (
                <input
                    type="number"
                    placeholder="Amount in ETH"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                />
            ) : (
                <input
                    type="text"
                    placeholder="Describe food donation"
                    value={foodDonation}
                    onChange={(e) => setFoodDonation(e.target.value)}
                />
            )}
            <button onClick={handleDonation}>{isETH ? 'Donate ETH' : 'Donate Food'}</button>
        </div>
    );
}

export default DonorDashboard;

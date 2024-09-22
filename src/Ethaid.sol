// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AidManagement {
    address public admin;

    struct AidRequest {
        string description;
        address requester;
        bool fulfilled;
    }

    mapping(uint => AidRequest) public aidRequests;
    uint public aidRequestCount;

    event AidRequested(uint indexed id, address indexed requester, string description);
    event SOSRaised(address indexed requester);
    event DonationReceived(address indexed donor, uint amount, string donationType);

    constructor() {
        admin = msg.sender;  // Set the contract creator as admin
    }

    // Function to receive ETH donations
    function donateETH() external payable {
        require(msg.value > 0, "Must send ETH to donate.");
        emit DonationReceived(msg.sender, msg.value, "ETH");
    }

    // Function to record food donations
    function donateFood(string memory details) public {
        emit DonationReceived(msg.sender, 0, details);
    }

    // Function to request aid
    function requestAid(string memory description) public {
        aidRequests[aidRequestCount] = AidRequest(description, msg.sender, false);
        emit AidRequested(aidRequestCount, msg.sender, description);
        aidRequestCount++;
    }

    // Function to raise SOS
    function raiseSOS() public {
        emit SOSRaised(msg.sender);
    }

    // Distributors can fetch aid requests
    function fetchAidRequest(uint id) public view returns (AidRequest memory) {
        require(id < aidRequestCount, "Aid request does not exist.");
        return aidRequests[id];
    }

    // Function to mark aid as fulfilled
    function fulfillAidRequest(uint id) public {
        require(msg.sender == admin, "Only admin can fulfill requests.");
        require(id < aidRequestCount, "Aid request does not exist.");
        AidRequest storage request = aidRequests[id];
        request.fulfilled = true;
    }
}

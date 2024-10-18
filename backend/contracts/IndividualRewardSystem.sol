// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the ERC20 interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract IndividualRewardSystem {
    IERC20 public token; // The ERC20 token being used for rewards
    address private _owner; // Owner of the contract

    // Event emitted when rewards are distributed
    event RewardDistributed(address indexed recipient, uint256 amount);
    event ContractBalanceChecked(uint256 balance); // Add event for balance checks

    // The address of the owner is set in the constructor
    constructor(address _tokenAddress, address ownerAddress) {
        token = IERC20(_tokenAddress); // Initialize the token contract
        _owner = ownerAddress; // Set the owner address
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == _owner, "Not the contract owner");
        _;
    }
    
    // Function to distribute rewards to a user
    function distributeReward(address recipient, uint256 amount) external onlyOwner {
        uint256 availableBalance = token.balanceOf(address(this)); // Renamed variable
        emit ContractBalanceChecked(availableBalance); // Emit current balance

        require(availableBalance >= amount, "Insufficient contract balance");

        // Transfer the tokens to the recipient
        token.transfer(recipient, amount);
        
        emit RewardDistributed(recipient, amount); // Emit event
    }

    // Function to withdraw tokens from the contract (only for owner)
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "Insufficient contract balance");

        // Transfer tokens back to the owner
        token.transfer(_owner, amount);
    }

    // Function to check the balance of tokens in the contract
    function contractBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}

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
    function distributeReward(address recipient, uint256 amount) external  {
        uint256 availableBalance = token.balanceOf(address(this)); // Renamed variable
        emit ContractBalanceChecked(availableBalance); // Emit current balance

        require(availableBalance >= amount, "Insufficient contract balance");

        // Transfer the tokens to the recipient
        token.transfer(recipient, amount);
        
        emit RewardDistributed(recipient, amount); // Emit event
    }

    // Function to distribute rewards to multiple users in a batch
    function distributeRewardsInBatch(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays must be of equal length");

        uint256 totalAmount = 0;

        // Calculate total amount to be distributed and ensure valid addresses/amounts
        for (uint256 i = 0; i < amounts.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            require(amounts[i] > 0, "Amount must be greater than zero");
            totalAmount += amounts[i];
        }

        uint256 availableBalance = token.balanceOf(address(this)); // Check contract balance
        emit ContractBalanceChecked(availableBalance); // Emit current balance
        require(availableBalance >= totalAmount, "Insufficient contract balance");

        // Transfer tokens to each recipient
        for (uint256 i = 0; i < recipients.length; i++) {
            token.transfer(recipients[i], amounts[i]);
            emit RewardDistributed(recipients[i], amounts[i]); // Emit event for each distribution
        }
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

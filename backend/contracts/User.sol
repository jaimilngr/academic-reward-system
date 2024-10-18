// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the ERC20 interface to interact with the ERC20 token
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract User {
    // Function to get the user's address
    function getUserAddress() public view returns (address) {
        return msg.sender; // Return the address of the caller
    }

    // Function to get the token balance of the user for a specific ERC20 token
    function getTokenBalance(address tokenAddress) public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(msg.sender); // Get the balance from the ERC20 token contract
    }
}

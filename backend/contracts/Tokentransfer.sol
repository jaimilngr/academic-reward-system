// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the ERC20 interface to interact with the ERC20 token
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract TokenTransfer {
    // Function to transfer tokens to a specified address
    function transferTokens(address tokenAddress, address recipient, uint256 amount) public returns (bool) {
        require(IERC20(tokenAddress).transfer(recipient, amount), "Transfer failed");
        return true;
    }

    // Function to allow users to transfer tokens from their account
    function transferTokensFromMe(address tokenAddress, address recipient, uint256 amount) public returns (bool) {
        require(IERC20(tokenAddress).transferFrom(msg.sender, recipient, amount), "Transfer failed");
        return true;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    address public owner;

    constructor(uint256 initialSupply, address _owner) ERC20("MyToken", "Cred") {
        require(_owner != address(0), "Owner address cannot be zero");
        owner = _owner; // Set the specified owner
        _mint(owner, initialSupply); 
        emit Transfer(address(0), owner, initialSupply); // Mint tokens to the specified owner
    }
}

require("dotenv").config(); // Load environment variables from .env file
const hre = require("hardhat");

async function main() {
    // Retrieve the contract address from environment variables
    const TokenAddress = process.env.TOKEN_ADDRESS; // ERC20 token address from .env
    const ownerAddress = process.env.ADMIN_ADDRESS;   // Admin address from .env

    // Validate that both addresses are provided
    if (!TokenAddress || !ownerAddress) {
        console.error("Please set the TOKEN_ADDRESS and ADMIN_ADDRESS in your .env file");
        process.exit(1);
    }

    // Get the contract factory for the AssignmentContract
    const AssignmentContract = await hre.ethers.getContractFactory("AssignmentContract");

    // Deploy the contract with the token address and admin address
    const assignmentContract = await AssignmentContract.deploy(TokenAddress, ownerAddress);

    // Wait for the contract to be deployed
    await assignmentContract.deployed();

    // Log the address of the deployed contract
    console.log("AssignmentContract deployed to:", assignmentContract.address);
}

// Execute the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });

require("dotenv").config();

const hre = require("hardhat");

async function main() {
    const initialSupply = hre.ethers.utils.parseUnits("1000000", 18); // Convert to smallest unit (1,000,000 tokens with 18 decimals)
    const ownerAddress = process.env.ADMIN_ADDRESS;

    // Deploy MyToken contract
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(initialSupply, ownerAddress);
    await myToken.deployed(); // Wait for the contract to be deployed

    console.log("MyToken deployed to:", myToken.address);

    // Deploy User contract (optional, depending on usage)
    const User = await hre.ethers.getContractFactory("User");
    const userContract = await User.deploy(); 
    await userContract.deployed(); // Wait for User contract deployment

    console.log("User contract deployed to:", userContract.address);
}

// Execute the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

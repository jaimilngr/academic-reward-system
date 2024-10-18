const hre = require("hardhat");

async function main() {
    const initialSupply = hre.ethers.utils.parseUnits("1000000", 18); // Convert to smallest unit (1,000,000 tokens with 18 decimals)
    const ownerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with the actual owner's address

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

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

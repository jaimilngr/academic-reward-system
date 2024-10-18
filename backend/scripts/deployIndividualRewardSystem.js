const hre = require("hardhat");

async function main() {
    // Replace this with the address of your already deployed ERC20 token
    const tokenAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"; // Update this with your token address
    const ownerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace this with the address of the owner (can be your wallet address)

    // Deploy the IndividualRewardSystem contract
    const IndividualRewardSystem = await hre.ethers.getContractFactory("IndividualRewardSystem");
    const rewardSystem = await IndividualRewardSystem.deploy(tokenAddress, ownerAddress); // Pass both token and owner address

    await rewardSystem.deployed();
    console.log("IndividualRewardSystem deployed to:", rewardSystem.address);
}

// Execute the main function and handle errors
main()
    .then(() => process.exit(0)) // Exit process successfully
    .catch((error) => {
        console.error(error); // Log any errors
        process.exit(1); // Exit process with error
    });

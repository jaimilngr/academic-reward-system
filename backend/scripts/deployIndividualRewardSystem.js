
require("dotenv").config();

const hre = require("hardhat");

async function main() {
    // Specific addresses for existing contracts
    const tokenAddress =  process.env.TOKEN_ADDRESS;
    const ownerAddress = process.env.ADMIN_ADDRESS;

    // Check if the token is already deployed
    const MyToken = await hre.ethers.getContractAt("MyToken", tokenAddress);
    console.log("MyToken already deployed at:", MyToken.address);

    // Deploy the IndividualRewardSystem contract using the existing token address
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

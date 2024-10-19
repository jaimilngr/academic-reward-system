require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
    solidity: "0.8.20",
    networks: {
        hardhat: {
            chainId: 1337, // Default chain ID for Hardhat local network
        },
    },
};

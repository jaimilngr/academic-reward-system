


# Academic Reward System

This project is a blockchain-based academic reward system that leverages an ERC-20 token called **Cred**. It enables **Admins** to reward **Students** for their academic performance and assignment completion using smart contracts deployed on the Ethereum blockchain. The frontend is built using **React**, integrated with **Ether.js** for seamless interaction with **MetaMask** and the deployed smart contracts.


## Overview

This academic reward system allows **Admins** to reward **Students** for their academic achievements and completion of assignments using our custom ERC-20 token, **Cred**. Admins can transfer tokens to students based on their marks, uploaded via an Excel sheet, and for completing specific assignments created by the admin.

## Features

- **ERC-20 Token - Cred**: A custom token that represents rewards for students.
- **Admin Role**:
  - Transfer tokens to students via MetaMask.
  - Upload marks via Excel (wallet addresses and marks).
  - Create assignments with token rewards.
- **Student Role**:
  - View assignments.
  - Submit assignment files.
  - Claim token rewards for completed assignments.
- **Blockchain Integration**: Built with Solidity smart contracts and deployed locally using Hardhat.
- **MetaMask Integration**: Students and admins interact with the blockchain using MetaMask.

## Tech Stack

- **Frontend**: React, Ether.js
- **Blockchain**: Solidity, Hardhat, Ethereum (local network)
- **Token Standard**: ERC-20
- **Wallet**: MetaMask

## Getting Started

### Prerequisites

To run this project, you’ll need:

- **Node.js** (v14 or higher)
- **MetaMask** (Browser Extension)
- **Hardhat** (For deploying and testing smart contracts)

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/academic-reward-system.git
    cd academic-reward-system
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Install Hardhat** (if you don't have it installed globally):
    ```bash
    npm install --save-dev hardhat
    ```

### Environment Variables

You will need to create environment variable files for both the **backend** (for deployment scripts and contracts) and **frontend** (for interacting with contracts via the React app).

#### Backend (.env)

Create a `.env` file in the root directory for your backend (Hardhat setup) with the following:

```
TOKEN_ADDRESS=<Deployed ERC-20 Token Contract Address>
ADMIN_ADDRESS=<Admin Wallet Address>
```

#### Frontend (.env)

Create a `.env` file in the root directory of your frontend with the following:

```
VITE_TOKEN_ADDRESS=<Deployed ERC-20 Token Contract Address>
VITE_ADMIN_ADDRESS=<Admin Wallet Address>
VITE_CONTRACT_ADDRESS=<Main Contract Address>
VITE_INDIVIDUALREWARD_ADDRESS=<Deployed Individual Reward Contract Address>
VITE_ASSIGNMENTREWARD_ADDRESS=<Deployed Assignment Contract Address>
```

Make sure you fill in the actual contract addresses once you deploy the contracts.

### Running Locally

1. **Start Hardhat Network**:
    ```bash
    npx hardhat node
    ```

2. **Deploy Smart Contracts**:
    We have three deployment scripts that handle different parts of the system. To deploy them, follow these steps:

    - **Deploy Token**:
      ```bash
      npx hardhat run scripts/deploy.js --network localhost
      ```

    - **Deploy Individual Reward System**:
      ```bash
      npx hardhat run scripts/deployIndividualRewardSystem.js --network localhost
      ```

    - **Deploy Assignment System**:
      ```bash
      npx hardhat run scripts/deployAssignment.js --network localhost
      ```

3. **Run the React Frontend**:
    ```bash
    npm start
    ```

4. **Connect MetaMask**: 
    - Open MetaMask in your browser.
    - Connect to the local Hardhat network using the network details provided when starting Hardhat.

## Usage

### Admin Role

- **Transfer Tokens**: Admins can transfer **Cred** tokens to student wallet addresses via MetaMask.
- **Upload Marks**: Upload an Excel sheet containing student wallet addresses and marks. The system calculates the corresponding tokens based on the marks, ensuring a fair distribution.
- **Create Assignments**: Admins can create assignments, specifying the title, description, and token rewards.

### Student Role

- **View Assignments**: Students can view assignments created by the admin.
- **Submit Assignments**: Students can upload their assignment files for review.
- **Claim Tokens**: After completing assignments, students can claim their token rewards.

Here's the updated section for your smart contracts:

---

## Smart Contract

The smart contracts are written in Solidity and deployed using **Hardhat** on a local blockchain network. The system consists of multiple contracts that handle different functionalities.

- **Smart Contract Files**:
  - `contracts/mytoken.sol`: Handles the ERC-20 token (**Cred**) contract.
  - `contracts/assignment.sol`: Manages assignment creation and rewards.
  - `contracts/user.sol`: Handles user-specific data and interactions.
  - `contracts/individualrewardsystem.sol`: Manages individual reward distribution based on marks and other criteria.

- **Deployment Scripts**:
  - `scripts/deploy.js`: Deploys the **Cred** token contract.
  - `scripts/deployIndividualRewardSystem.js`: Deploys the individual reward system.
  - `scripts/deployAssignment.js`: Deploys the assignment system.

These contracts can be interacted with through **MetaMask** and the **Ether.js** library in the frontend.

---

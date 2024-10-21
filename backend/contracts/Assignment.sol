// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for interacting with the ERC20 token
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract AssignmentContract {
    IERC20 public token;  // The ERC20 token used for rewards
    address public admin; // Admin address, can be the owner/teacher

    // Structure to store assignment details
    struct Assignment {
        string title;
        uint256 rewardAmount;
        bool exists; // To track if the assignment has been created
    }

    // Mapping of assignment IDs to Assignment details
    mapping(uint256 => Assignment) public assignments;

    // Nested mapping to track if a student has claimed rewards for each assignment
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    // Mapping to track completed assignments for each student
    mapping(address => mapping(uint256 => bool)) public completedAssignments;

    // To track the total number of assignments created
    uint256 public totalAssignmentCount;

    // Event emitted when a student receives a reward
    event RewardClaimed(address indexed student, uint256 assignmentId, uint256 amount);
    event AssignmentCreated(uint256 assignmentId, string title, uint256 rewardAmount);
    event AssignmentCompleted(address indexed student, uint256 assignmentId);

    // Constructor to initialize the token address and set the admin address
    constructor(address tokenAddress, address ownerAddress) {
        token = IERC20(tokenAddress);
        admin = ownerAddress; // Set the admin to the provided owner address
    }

    // Modifier to allow only the admin to perform certain actions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Function for the admin to create a new assignment
    function createAssignment(uint256 assignmentId, string memory title, uint256 rewardAmount) external onlyAdmin {
        require(!assignments[assignmentId].exists, "Assignment already exists"); // Check if it already exists

        assignments[assignmentId] = Assignment({
            title: title,
            rewardAmount: rewardAmount,
            exists: true // Set exists to true
        });

        totalAssignmentCount++; // Increment the total assignment count

        emit AssignmentCreated(assignmentId, title, rewardAmount);
    }

    // Function to get an assignment's details by ID
    function getAssignment(uint256 assignmentId) public view returns (string memory title, uint256 rewardAmount) {
        Assignment memory assignment = assignments[assignmentId];
        require(assignment.exists, "Assignment does not exist"); // Check if it exists
        return (assignment.title, assignment.rewardAmount);
    }

    // Function for a student to complete an assignment
    function completeAssignment(uint256 assignmentId) external {
        require(assignments[assignmentId].exists, "Assignment does not exist");
        require(!completedAssignments[msg.sender][assignmentId], "Assignment already completed"); // Ensure not already completed

        completedAssignments[msg.sender][assignmentId] = true;

        emit AssignmentCompleted(msg.sender, assignmentId);
    }

    // Function to get uncompleted assignments for a student
    function getUncompletedAssignments() external view returns (Assignment[] memory) {
        uint256 count = 0;

        // Count uncompleted assignments for the student
        for (uint256 i = 1; i <= totalAssignmentCount; i++) {
            if (!completedAssignments[msg.sender][i] && assignments[i].exists) {
                count++;
            }
        }

        Assignment[] memory uncompletedAssignments = new Assignment[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalAssignmentCount; i++) {
            if (!completedAssignments[msg.sender][i] && assignments[i].exists) {
                uncompletedAssignments[index] = assignments[i];
                index++;
            }
        }

        return uncompletedAssignments;
    }

// Function to claim the reward after completing an assignment
    function claimReward(uint256 assignmentId) external {
        require(assignments[assignmentId].exists, "Assignment does not exist");
        require(completedAssignments[msg.sender][assignmentId], "You have not completed this assignment"); // Ensure student completed it
        require(!hasClaimed[assignmentId][msg.sender], "You have already claimed reward for this assignment");

        uint256 rewardAmount = assignments[assignmentId].rewardAmount;
        uint256 balance = token.balanceOf(address(this)); // Get contract's token balance
        require(balance >= rewardAmount, "Insufficient contract balance");

        // Mark student as having claimed the reward for this assignment
        hasClaimed[assignmentId][msg.sender] = true;

        // Transfer tokens to the student
        token.transfer(msg.sender, rewardAmount);

        // Emit event for the reward claim
        emit RewardClaimed(msg.sender, assignmentId, rewardAmount);
    }

    // Function to withdraw remaining tokens (if needed)
    function withdrawTokens(uint256 amount) external onlyAdmin {
        uint256 balance = token.balanceOf(address(this)); // Renamed variable
        require(balance >= amount, "Insufficient balance to withdraw");

        // Transfer tokens back to the admin
        token.transfer(admin, amount);
    }

    // Function to check the current balance of the contract
    function contractBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}

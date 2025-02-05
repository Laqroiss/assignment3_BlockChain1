require("dotenv").config(); // Ensure .env is loaded
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",  // Default local Hardhat network URL
      accounts: [`0x${process.env.PRIVATE_KEY}`],  // Use the private key from .env
    },
  },
  paths: {
    artifacts: "./src/artifacts",  // Ensure this path is correct if you're using a custom folder
  },
};


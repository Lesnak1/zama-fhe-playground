require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    // FHEVM Testnet configuration
    fhevmTestnet: {
      url: "https://devnet.zama.ai",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 9000,
      gasPrice: 20000000000, // 20 gwei
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 20,
    showTimeSpent: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: {
      fhevmTestnet: process.env.FHEVM_ETHERSCAN_API_KEY || "dummy-key",
    },
    customChains: [
      {
        network: "fhevmTestnet",
        chainId: 9000,
        urls: {
          apiURL: "https://explorer.zama.ai/api",
          browserURL: "https://explorer.zama.ai",
        },
      },
    ],
  },
  mocha: {
    timeout: 60000, // 60 seconds for FHE operations
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

require("@nomiclabs/hardhat-waffle");
const secretKeys = require("./secret.json");

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  /*networks: {
    ropsten: {
      url: secretKeys.testnet.url,
      accounts: [secretKeys.testnet.key]
    },
  },*/
  paths: {
    sources: "./src/contracts",
    tests: "./src/test"
  }
};

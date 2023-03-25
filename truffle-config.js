require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const mnemonic = process.env.MNEMONIC.toString().trim()
module.exports = {
  networks: {
    // connect Ganache. Useful for testing
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // Match any network id
    },
    matic: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,                                         // Mnemonic phrase
          `https://matic-mumbai.chainstacklabs.com`,        // RPC URL
        ),
      network_id: 80001,    // Chain ID
      confirmations: 2,     // # of confs to wait between deployments
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  contracts_build_directory: './src/abis/',
  // Configure your compilers
  compilers: {
    solc: {
      version: '^0.6.0',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}

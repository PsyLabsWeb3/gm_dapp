# MzcalToken Smart Contract

This project contains the MzcalToken smart contract and associated scripts for deployment and management on Arbitrum networks (testnet and mainnet).

## Prerequisites

- Node.js (v16 or higher)
- Hardhat development environment
- Arbitrum network access keys

## Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
# Arbitrum Sepolia Testnet
ARBITRUM_SEPOLIA_RPC=<your_arbitrum_sepolia_rpc_url>

# Arbitrum Mainnet (for future use)
ARBITRUM_MAINNET_RPC=<your_arbitrum_mainnet_rpc_url>

# Private key for deployment (your wallet's private key)
PRIVATE_KEY=<your_private_key>

# Etherscan API Key for contract verification
ARBISCAN_API_KEY=<your_arbiscan_api_key>
```

## Core Scripts

### Deploy MzcalToken Contract

Deploy the MzcalToken contract to your selected network.

```bash
# Deploy to localhost
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to Arbitrum Sepolia testnet
npx hardhat run scripts/deploy.ts --network arbitrum-sepolia

# Deploy to Arbitrum mainnet
npx hardhat run scripts/deploy.ts --network arbitrum
```

### Add Admins and Whitelist Addresses

Add admin addresses and whitelist addresses to the deployed contract.

```bash
# Using environment variable for contract address
MZCAL_CONTRACT_ADDRESS=0xYourContractAddress npx hardhat run scripts/addAdminsAndWhitelist.ts --network arbitrum-sepolia

# Using contract address as command line argument
npx hardhat run scripts/addAdminsAndWhitelist.ts --network arbitrum-sepolia 0xYourContractAddress

# Using custom admin and whitelist addresses
MZCAL_CONTRACT_ADDRESS=0xYourContractAddress ADMIN_ADDRESSES="0xAddr1,0xAddr2" WHITELIST_ADDRESSES="0xAddr3,0xAddr4,0xAddr5" npx hardhat run scripts/addAdminsAndWhitelist.ts --network arbitrum-sepolia
```

### Set Token Prices

Set presale and MZCAL token prices in wei.

```bash
# Using default prices (0.001 ETH for presale, 0.002 ETH for MZCAL)
MZCAL_CONTRACT_ADDRESS=0xYourContractAddress npx hardhat run scripts/setTokenPrices.ts --network arbitrum-sepolia

# Using custom prices
MZCAL_CONTRACT_ADDRESS=0xYourContractAddress PRESALE_TOKEN_PRICE_ETH=0.005 MZCAL_TOKEN_PRICE_ETH=0.01 npx hardhat run scripts/setTokenPrices.ts --network arbitrum-sepolia
```

## Available Networks

- `localhost` - Local Hardhat network for development
- `arbitrum-sepolia` - Arbitrum Sepolia testnet
- `arbitrum` - Arbitrum mainnet

## Deployment Process

1. **Deploy Contract**: Use `deploy.ts` to deploy the MzcalToken contract
2. **Add Admins**: Use `addAdminsAndWhitelist.ts` to set up admin accounts
3. **Set Prices**: Use `setTokenPrices.ts` to configure token prices
4. **Verify Contract**: Contract addresses and ABIs are automatically saved for verification

## Contract Features

- **ERC1155 Token**: Implements the ERC1155 standard for multi-token support
- **Admin Management**: Role-based access control for privileged operations
- **Presale Whitelist**: Restrict presale access to whitelisted addresses
- **Price Configuration**: Adjustable token prices for presale and standard sales
- **Dual Token System**: MZCAL (ID: 1) and PRESALE_TOKEN (ID: 2)

## Testing

Run the following command to test the contracts:

```bash
npx hardhat test
```

## Local Development

Start a local Hardhat node:

```bash
npx hardhat node
```

This will start a local development network on `http://127.0.0.1:8545/` with pre-funded accounts for development.

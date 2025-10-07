#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

// Configuration
const CONTRACT_ADDRESS = '0x7B22e1a3272B639AE399405A8f50ddD822B836C6';
const NETWORK = 'arbitrum-sepolia';
const COMPILER_VERSION = 'v0.8.28+commit.7893614a';
const OPTIMIZATION_ENABLED = false;
const RUNS = 200;

// Read the flattened contract
const contractSource = fs.readFileSync('./final_flattened_MzcalToken.sol', 'utf8');

// Extract the constructor arguments from your deployment
// Based on your deployment, the constructor argument was:
// "https://api.example.com/token/{id}.json"
const CONSTRUCTOR_ARGUMENTS = '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004568747470733a2f2f6170692e6578616d706c652e636f6d2f746f6b656e2f7b69647d2e6a736f6e00000000000000000000000000000000000000000000000000';

console.log('Verifying MzcalToken contract...');
console.log(`Contract Address: ${CONTRACT_ADDRESS}`);
console.log(`Network: ${NETWORK}`);
console.log(`Compiler Version: ${COMPILER_VERSION}`);

try {
  // Run the verification command
  const command = `npx hardhat verify --network ${NETWORK} ${CONTRACT_ADDRESS} "https://api.example.com/token/{id}.json"`;
  
  console.log('Running verification command:');
  console.log(command);
  
  // Execute the verification
  const output = execSync(command, { cwd: process.cwd(), stdio: 'inherit' });
  
  console.log('Verification completed successfully!');
} catch (error: any) {
  console.error('Verification failed:', error.message);
  console.log('Manual verification instructions:');
  console.log('');
  console.log('1. Go to https://sepolia.arbiscan.io/');
  console.log(`2. Search for contract address: ${CONTRACT_ADDRESS}`);
  console.log('3. Click on "Contract" tab');
  console.log('4. Click on "Verify and Publish"');
  console.log('5. Select the following options:');
  console.log('   - Compiler Type: Solidity (Single file)');
  console.log(`   - Compiler Version: ${COMPILER_VERSION}`);
  console.log('   - Optimization Enabled: No');
  console.log('   - Runs: 200');
  console.log('   - Contract Name: MzcalToken');
  console.log('   - Constructor Arguments: 0x' + CONSTRUCTOR_ARGUMENTS);
  console.log('6. Paste the contents of final_flattened_MzcalToken.sol into the source code field');
  console.log('7. Click "Verify and Publish"');
}
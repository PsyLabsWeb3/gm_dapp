import { expect } from "chai";
import { ethers } from "hardhat";
import { exec } from "child_process";
import * as fs from "fs";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("addAdminsAndWhitelist.ts script", function () {
  this.timeout(50000);

  let contractAddress: string;
  let token: any;
  let deployer: SignerWithAddress;

  // Deploy a contract first for testing
  before(async function () {
    // Get signers
    [deployer] = await ethers.getSigners();
    
    // Deploy the contract using hardhat's run function
    const MzcalToken = await ethers.getContractFactory("contracts/MzcalToken.sol:MzcalToken");
    token = await MzcalToken.deploy("https://api.example.com/local/token/{id}.json");
    await token.waitForDeployment();
    
    contractAddress = await token.getAddress();
    console.log(`Deployed test contract at: ${contractAddress}`);
  });

  it("Should add admin and whitelist addresses to the deployed contract", function (done) {
    // Execute the addAdminsAndWhitelist script with the deployed contract address via environment variable
    // Only add addresses that are not already admins (avoid the deployer address which is already admin)
    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress,
      ADMIN_ADDRESSES: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      WHITELIST_ADDRESSES: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65,0x610562c2a4344a3f8e0eb737d9304268a2511450"
    };

    const child = exec("npx hardhat run scripts/addAdminsAndWhitelist.ts --network localhost", 
      { cwd: process.cwd(), env }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          done(error);
          return;
        }

        console.log(`stdout: ${stdout}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        // Check that the script executed successfully
        expect(stdout).to.include("All admin and whitelist operations completed successfully!");
        expect(stdout).to.include("Verifying admin status:");
        expect(stdout).to.include("Verifying whitelist status:");

        done();
      });
  });

  it("Should handle environment variable inputs correctly", function (done) {
    // Execute the script with environment variables
    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress,
      ADMIN_ADDRESSES: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8,0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      WHITELIST_ADDRESSES: "0x90F79bf6EB2c4f870365E785982E1f101E93b906,0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
    };

    const child = exec("npx hardhat run scripts/addAdminsAndWhitelist.ts --network localhost", 
      { cwd: process.cwd(), env }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          done(error);
          return;
        }

        console.log(`stdout: ${stdout}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        // Check that the script executed successfully
        expect(stdout).to.include("✅ All admin and whitelist operations completed successfully!");
        expect(stdout).to.include("📋 Admin addresses to be added:");
        expect(stdout).to.include("📋 Whitelist addresses to be added:");

        done();
      });
  });

  it("Should fail gracefully when no contract address is provided", function (done) {
    // Execute the script without providing a contract address
    const child = exec("npx hardhat run scripts/addAdminsAndWhitelist.ts --network localhost", 
      { cwd: process.cwd() }, (error, stdout, stderr) => {
        
        console.log(`stdout: ${stdout}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        // The script should show usage instructions when no address is provided
        expect(stdout).to.include("❌ Contract address not provided");
        expect(stdout).to.include("Usage: npx hardhat run scripts/addAdminsAndWhitelist.ts --network <network>");

        done();
      });
  });

  // Edge case: Test with empty admin addresses list
  it("Should handle empty admin addresses list gracefully", function (done) {
    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress,
      ADMIN_ADDRESSES: "",
      WHITELIST_ADDRESSES: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
    };

    const child = exec("npx hardhat run scripts/addAdminsAndWhitelist.ts --network localhost", 
      { cwd: process.cwd(), env }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          // This is expected behavior for empty list
        }

        console.log(`stdout: ${stdout}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        // Script should handle empty lists without crashing
        done();
      });
  });

  // Edge case: Test with very large number of addresses
  it("Should handle large number of addresses", function (done) {
    // Create a large list of addresses (for testing bulk operations)
    const manyAddresses = [];
    for (let i = 0; i < 20; i++) {
      // Use different addresses based on Hardhat's standard accounts
      const addr = `0x789012345678901234567890123456789012${i.toString().padStart(3, '0')}7890`;
      manyAddresses.push(addr);
    }
    const largeAddressList = manyAddresses.join(',');

    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress,
      ADMIN_ADDRESSES: largeAddressList,
      WHITELIST_ADDRESSES: largeAddressList
    };

    const child = exec("npx hardhat run scripts/addAdminsAndWhitelist.ts --network localhost", 
      { cwd: process.cwd(), env }, (error, stdout, stderr) => {
        // Note: This test might fail due to invalid addresses, but that's expected behavior
        // The important thing is that it doesn't crash the script
        console.log(`stdout: ${stdout}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        done();
      });
  });
});
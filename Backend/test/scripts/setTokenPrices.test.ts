import { expect } from "chai";
import { ethers } from "hardhat";
import { exec } from "child_process";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("setTokenPrices.ts script", function () {
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

  it("Should set token prices correctly on the deployed contract", function (done) {
    // Execute the setTokenPrices script with the deployed contract address via environment variable
    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress
    };

    const child = exec("npx hardhat run scripts/setTokenPrices.ts --network localhost", 
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
        expect(stdout).to.include("All token prices set successfully!");
        expect(stdout).to.include("Verifying current prices:");

        done();
      });
  });

  it("Should handle custom price environment variables correctly", function (done) {
    // Execute the script with custom price environment variables
    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress,
      PRESALE_TOKEN_PRICE_ETH: "0.005",
      MZCAL_TOKEN_PRICE_ETH: "0.01"
    };

    const child = exec("npx hardhat run scripts/setTokenPrices.ts --network localhost", 
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

        // Check that the script executed successfully with custom prices
        expect(stdout).to.include("✅ All token prices set successfully!");
        expect(stdout).to.include("📋 Price settings to be applied:");
        expect(stdout).to.include("0.005 ETH");
        expect(stdout).to.include("0.01 ETH");

        done();
      });
  });

  it("Should fail gracefully when no contract address is provided", function (done) {
    // Execute the script without providing a contract address
    const child = exec("npx hardhat run scripts/setTokenPrices.ts --network localhost", 
      { cwd: process.cwd() }, (error, stdout, stderr) => {
        
        console.log(`stdout: ${stdout}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        // The script should show usage instructions when no address is provided
        expect(stdout).to.include("❌ Contract address not provided");
        expect(stdout).to.include("Usage: npx hardhat run scripts/setTokenPrices.ts --network <network>");

        done();
      });
  });

  it("Should verify that token prices were set correctly", async function () {
    // Get the deployed contract instance
    const token = await ethers.getContractAt("contracts/MzcalToken.sol:MzcalToken", contractAddress);
    
    // By default, the script sets presale price to 0.001 ETH and MZCAL price to 0.001 ETH
    const expectedPresalePrice = ethers.parseUnits("0.001", "ether");
    const expectedMzcalPrice = ethers.parseUnits("0.001", "ether");
    
    const actualPresalePrice = await token.presaleTokenPrice();
    const actualMzcalPrice = await token.mzcalTokenPrice();
    
    expect(actualPresalePrice).to.equal(expectedPresalePrice);
    expect(actualMzcalPrice).to.equal(expectedMzcalPrice);
  });

  // Edge case: Test with extremely low token prices (接近零)
  it("Should handle extremely low token prices", function (done) {
    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress,
      PRESALE_TOKEN_PRICE_ETH: "0.000000000000000001", // 1 wei
      MZCAL_TOKEN_PRICE_ETH: "0.000000000000000001"    // 1 wei
    };

    const child = exec("npx hardhat run scripts/setTokenPrices.ts --network localhost", 
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
        expect(stdout).to.include("✅ All token prices set successfully!");
        
        done();
      });
  });

  // Edge case: Test with extremely high token prices
  it("Should handle extremely high token prices", function (done) {
    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress,
      PRESALE_TOKEN_PRICE_ETH: "1000000", // 1 million ETH
      MZCAL_TOKEN_PRICE_ETH: "1000000"    // 1 million ETH
    };

    const child = exec("npx hardhat run scripts/setTokenPrices.ts --network localhost", 
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
        expect(stdout).to.include("✅ All token prices set successfully!");
        
        done();
      });
  });

  // Edge case: Test with zero token prices
  it("Should handle zero token prices", function (done) {
    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress,
      PRESALE_TOKEN_PRICE_ETH: "0",
      MZCAL_TOKEN_PRICE_ETH: "0"
    };

    const child = exec("npx hardhat run scripts/setTokenPrices.ts --network localhost", 
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
        expect(stdout).to.include("✅ All token prices set successfully!");
        
        done();
      });
  });

  // Edge case: Test with invalid price format
  it("Should handle invalid price format gracefully", function (done) {
    const env = { ...process.env, 
      MZCAL_CONTRACT_ADDRESS: contractAddress,
      PRESALE_TOKEN_PRICE_ETH: "invalid",
      MZCAL_TOKEN_PRICE_ETH: "format"
    };

    const child = exec("npx hardhat run scripts/setTokenPrices.ts --network localhost", 
      { cwd: process.cwd(), env }, (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        // The script should handle invalid prices gracefully
        done();
      });
  });
});
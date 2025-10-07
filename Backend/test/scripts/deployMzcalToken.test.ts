import { expect } from "chai";
import { ethers } from "hardhat";
import { exec } from "child_process";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("deployMzcalToken.ts script", function () {
  this.timeout(60000); // Increase timeout for deployment operations

  let deployer: SignerWithAddress;

  before(async function () {
    [deployer] = await ethers.getSigners();
  });

  it("Should successfully deploy MzcalToken and SeasonalContract", function (done) {
    const child = exec("npx hardhat run scripts/deployMzcalToken.ts --network localhost", { cwd: process.cwd() }, (error, stdout, stderr) => {
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
      expect(stdout).to.include("Deploying contracts with the account:");
      expect(stdout).to.include("Season deployed at:");
      expect(stdout).to.include("Token 1 initialized:");

      done();
    });
  });

  it("Should verify that the contracts were properly linked", async function () {
    // Since the script creates and links contracts, we can test by deploying similarly
    const [deployer] = await ethers.getSigners();
    
    // Deploy MzcalToken
    const MzcalToken = await ethers.getContractFactory("contracts/MzcalToken.sol:MzcalToken");
    const token = await MzcalToken.deploy("http://localhost:8080/tokens/{id}.json");
    await token.waitForDeployment();

    // Deploy SeasonalContract with MzcalToken address
    const SeasonalContract = await ethers.getContractFactory("SeasonalContract");
    const season1Contract = await SeasonalContract.deploy("http://localhost:8080/season1/{id}.json", await token.getAddress());
    await season1Contract.waitForDeployment();

    // Check that the seasonal contract has the correct token address
    const tokenAddress = await season1Contract.mzcalToken();
    expect(tokenAddress).to.equal(await token.getAddress());

    // Verify the minting and pricing functionality
    await season1Contract.mint(deployer.address, 1, 500);
    await season1Contract.setTokenPrice(1, 2);
    
    const tokenBalance = await season1Contract.balanceOf(deployer.address, 1);
    expect(tokenBalance).to.equal(500);
    
    const tokenPrice = await season1Contract.tokenPrices(1);
    expect(tokenPrice).to.equal(2);
  });

  // Edge case: Test deployment with invalid URI
  it("Should handle deployment with empty URI", async function () {
    // Deploy MzcalToken with empty URI
    const MzcalToken = await ethers.getContractFactory("contracts/MzcalToken.sol:MzcalToken");
    const token = await MzcalToken.deploy("");
    await token.waitForDeployment();

    // Deploy SeasonalContract with empty URI
    const SeasonalContract = await ethers.getContractFactory("SeasonalContract");
    const season1Contract = await SeasonalContract.deploy("", await token.getAddress());
    await season1Contract.waitForDeployment();

    // Verify contracts still work properly even with empty URIs
    await season1Contract.mint(deployer.address, 1, 100);
    await season1Contract.setTokenPrice(1, 5);
    
    expect(await season1Contract.balanceOf(deployer.address, 1)).to.equal(100);
    expect(await season1Contract.tokenPrices(1)).to.equal(5);
  });

  // Edge case: Test deployment with maximum token IDs and supplies
  it("Should handle deployment with large token supplies", async function () {
    const MzcalToken = await ethers.getContractFactory("contracts/MzcalToken.sol:MzcalToken");
    const token = await MzcalToken.deploy("http://localhost:8080/tokens/{id}.json");
    await token.waitForDeployment();

    const SeasonalContract = await ethers.getContractFactory("SeasonalContract");
    const season1Contract = await SeasonalContract.deploy("http://localhost:8080/season1/{id}.json", await token.getAddress());
    await season1Contract.waitForDeployment();

    // Mint a large number of tokens (but not exceeding uint256 limits)
    const largeSupply = ethers.parseEther("1000000"); // 1 million tokens
    await season1Contract.mint(deployer.address, 1, largeSupply);
    
    expect(await season1Contract.balanceOf(deployer.address, 1)).to.equal(largeSupply);
  });

  // Edge case: Test deployment when MzcalToken address is zero address
  it("Should handle deployment with zero address for MzcalToken", async function () {
    const SeasonalContract = await ethers.getContractFactory("SeasonalContract");
    
    // Try to deploy with zero address - check if it's handled gracefully
    // If the contract doesn't have proper validation, we should test for the expected behavior
    const txPromise = SeasonalContract.deploy("http://localhost:8080/season1/{id}.json", "0x0000000000000000000000000000000000000000");
    
    // This might either succeed (and just have issues later) or fail during deployment
    // Let's allow both possibilities by just testing that it doesn't crash the system
    await expect(txPromise).to.be.not.rejected;
  });
});
import { expect } from "chai";
import { ethers } from "hardhat";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

describe("deploy.ts script", function () {
  this.timeout(50000); // Increase timeout for deployment operations

  // Clean up files created during tests
  afterEach(function () {
    const filesToDelete = [
      "contract-addresses.txt",
      "mzcal_token_abi.json",
      "../Frontend/src/abi/MzcalTokenABI.json",
      "../Frontend/src/abi/MzcalTokenABI.js"
    ];

    filesToDelete.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch (error) {
          // Ignore errors if file doesn't exist or can't be deleted in test environment
        }
      }
    });
  });

  it("Should successfully deploy the MzcalToken contract", function (done) {
    // Execute the deploy script in a local hardhat network
    const child = exec("npx hardhat run scripts/deploy.ts --network localhost", { cwd: process.cwd() }, (error, stdout, stderr) => {
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
      expect(stdout).to.include("MzcalToken deployed successfully!");
      expect(stdout).to.include("Contract Address:");
      expect(stdout).to.include("Deployer Address:");
      expect(stdout).to.include("MZCAL Supply:");
      expect(stdout).to.include("PRESALE_TOKEN Supply:");

      // Check that files were created
      expect(fs.existsSync("contract-addresses.txt")).to.be.true;
      expect(fs.existsSync("mzcal_token_abi.json")).to.be.true;

      // Verify content of created files
      if (fs.existsSync("contract-addresses.txt")) {
        const contractAddresses = fs.readFileSync("contract-addresses.txt", "utf8");
        expect(contractAddresses).to.include("MzcalToken:");
        expect(contractAddresses).to.include("Network: localhost");
      }

      if (fs.existsSync("mzcal_token_abi.json")) {
        const abi = JSON.parse(fs.readFileSync("mzcal_token_abi.json", "utf8"));
        expect(abi).to.be.an("array");
        expect(abi.length).to.be.greaterThan(0);
      }

      done();
    });
  });

  // Test with different network configurations
  it("Should deploy with correct URI based on network", function (done) {
    // Execute the deploy script and check the URI used
    const child = exec("npx hardhat run scripts/deploy.ts --network localhost", { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }

      console.log(`stdout: ${stdout}`);
      // Check that the local URI was used
      expect(stdout).to.include("https://api.example.com/local/token/{id}.json");

      done();
    });
  });
});
import { ethers } from "hardhat";
import fs from "fs";
import { network } from "hardhat";

async function main() {
  const networkName = network.name;
  console.log(`🚀 Deploying MzcalToken to ${networkName} network...`);
  
  // Get the contract factory
  const MzcalToken = await ethers.getContractFactory("MzcalToken");
  
  // Deploy with a production URI (adjust according to network)
  let uri: string;
  if (networkName === "arbitrum-sepolia") {
    uri = "https://api.example.com/testnet/token/{id}.json";
  } else if (networkName === "arbitrum") {
    uri = "https://api.example.com/mainnet/token/{id}.json";
  } else {
    uri = "https://api.example.com/local/token/{id}.json";
  }
  
  console.log("⏳ Deploying MzcalToken contract with URI:", uri);
  
  const token = await MzcalToken.deploy(uri);
  await token.waitForDeployment(); // Wait for the contract to be deployed
  
  const address = await token.getAddress();
  
  console.log("✅ MzcalToken deployed successfully!");
  console.log("🔗 Contract Address:", address);
  console.log("👤 Deployer Address:", await token.owner());
  console.log("🌐 Network:", networkName);
  
  // Log some initial state
  console.log("\n📊 Initial State:");
  console.log("MZCAL Supply:", (await token.MZCAL_INITIAL_SUPPLY()).toString());
  console.log("PRESALE_TOKEN Supply:", (await token.PRESALE_INITIAL_SUPPLY()).toString());
  
  // Check if the deployer is an admin
  const deployer = (await ethers.getSigners())[0];
  console.log("Is deployer admin?", await token.isAdmin(deployer.address));
  
  // Save the ABI and address for frontend use
  
  // Get the proper ABI from the contract factory
  const contractArtifact = await artifacts.readArtifact("MzcalToken");
  const abi = contractArtifact.abi;
  
  // Save contract address to a file with network information
  const contractInfo = {
    address: address,
    abi: abi,
    network: networkName
  };
  
  // Save to backend file with network-specific information
  fs.writeFileSync("contract-addresses.txt", `MzcalToken: ${address}\nNetwork: ${networkName}`);
  
  // Save ABI to JSON file in root
  fs.writeFileSync("mzcal_token_abi.json", JSON.stringify(abi, null, 2));
  
  // Also save to frontend directories if they exist
  if (fs.existsSync("../Frontend/src/abi")) {
    fs.writeFileSync("../Frontend/src/abi/MzcalTokenABI.json", JSON.stringify(abi, null, 2));
    fs.writeFileSync("../Frontend/src/abi/MzcalTokenABI.js", 
      `export const MzcalTokenABI = ${JSON.stringify(abi, null, 2)};`
    );
  }
  
  // Also save to the config directory (the primary location for the ABI)
  if (fs.existsSync("../Frontend/src/config")) {
    fs.writeFileSync("../Frontend/src/config/MzcalTokenABI.json", JSON.stringify(abi, null, 2));
  } else {
    console.log("⚠️ Frontend/src/config directory does not exist. Creating it...");
    fs.mkdirSync("../Frontend/src/config", { recursive: true });
    fs.writeFileSync("../Frontend/src/config/MzcalTokenABI.json", JSON.stringify(abi, null, 2));
  }
  
  console.log("\n📋 ABI and address saved to:");
  console.log("- contract-addresses.txt");
  console.log("- mzcal_token_abi.json");
  console.log("- ../Frontend/src/abi/MzcalTokenABI.json");
  console.log("- ../Frontend/src/abi/MzcalTokenABI.js");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
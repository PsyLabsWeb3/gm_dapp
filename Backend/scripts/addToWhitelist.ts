import { ethers } from "hardhat";

async function main() {
  console.log("Adding addresses to MzcalToken presale whitelist...");
  
  // Get the deployed contract address - command line args take precedence over environment variable
  let contractAddress;
  
  // First, check command line arguments for contract address (with specific format)
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    // Check for direct address argument
    if (args[i].startsWith('0x') && args[i].length === 42) { // Ethereum address format check
        contractAddress = args[i];
        break;
    }
    // Check for --contract-address flag
    if (args[i] === '--contract-address' && i + 1 < args.length) {
        contractAddress = args[i + 1];
        break;
    }
  }
  
  // Only check environment variable if not provided via command line
  if (!contractAddress) {
    contractAddress = process.env.MZCAL_CONTRACT_ADDRESS;
  }

  if (!contractAddress || contractAddress.trim() === '') {
    console.log("Contract address not provided");
    console.log("Usage: npx hardhat run scripts/addToWhitelist.ts --network <network> [contract_address]");
    console.log("   Or: npx hardhat run scripts/addToWhitelist.ts --network <network> --contract-address <address>");
    console.log("   Or set MZCAL_CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }
  
  // Get the contract instance
  let token;
  try {
    token = await ethers.getContractAt("MzcalToken", contractAddress);
  } catch (error) {
    console.error(" Error connecting to contract:", error);
    process.exit(1);
  }
  
  // Example addresses to add to whitelist (replace with actual addresses you want to whitelist)
  const rawAddressesToWhitelist: string[] = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
  ];
  
  // Validate addresses before processing and filter out invalid ones
  const addressesToWhitelist: string[] = [];
  for (const addr of rawAddressesToWhitelist) {
    if (ethers.isAddress(addr)) {
      addressesToWhitelist.push(addr);
    } else {
      console.error(` Invalid whitelist address: ${addr}`);
    }
  }
  
  console.log(" Addresses to be added to whitelist:");
  addressesToWhitelist.forEach((addr, index) => {
    console.log(`  ${index + 1}. ${addr}`);
  });
  
  console.log("\n Adding addresses to whitelist...");
  
  try {
    // Add addresses to whitelist one by one
    for (let i = 0; i < addressesToWhitelist.length; i++) {
      const addr = addressesToWhitelist[i];
      console.log(`  Adding ${addr}...`);
      
      const tx = await token.addToPresaleWhitelist(addr);
      await tx.wait();
      
      console.log(`   ${addr} added successfully`);
    }
    
    console.log("\n All addresses added to whitelist successfully!");
    
    // Verify that the addresses were added (with error handling)
    console.log("\n Verifying whitelist status:");
    for (const addr of addressesToWhitelist) {
      try {
        const isWhitelisted = await token.isWhitelisted(addr);
        console.log(`  ${addr}: ${isWhitelisted ? 'Whitelisted' : 'Not Whitelisted'}`);
      } catch (error) {
        console.log(`  ${addr}: Could not verify whitelist status`);
      }
    }
    
    // You can also use bulkAddToPresaleWhitelist for multiple addresses at once
    console.log("\n Note: You can also use bulkAddToPresaleWhitelist() for adding multiple addresses in a single transaction:");
    console.log("   const tx = await token.bulkAddToPresaleWhitelist([address1, address2, ...]);");
  } catch (error: any) {
    console.error("Error adding addresses to whitelist:", error);
  }
}

// Execute the function
main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
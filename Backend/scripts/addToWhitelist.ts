import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Adding addresses to MzcalToken presale whitelist...");
  
  // Get the deployed contract address from environment variable or command line
  const contractAddress = process.env.MZCAL_CONTRACT_ADDRESS || process.argv[2];

  if (!contractAddress) {
    console.log("❌ Contract address not provided. Usage: npx hardhat run scripts/addToWhitelist.ts --network <network> [contract_address]");
    console.log("   Or set MZCAL_CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }
  
  // Get the contract instance
  const token = await ethers.getContractAt("MzcalToken", contractAddress);
  
  // Example addresses to add to whitelist (replace with actual addresses you want to whitelist)
  const rawAddressesToWhitelist: string[] = [
    "0x1234567890123456789012345678901234567890",
    "0x1234567890123456789012345678901234567890",
    "0x1234567890123456789012345678901234567890"
  ];
  
  // Validate addresses before processing
  for (const addr of rawAddressesToWhitelist) {
    if (!ethers.isAddress(addr)) {
      console.error(`❌ Invalid whitelist address: ${addr}`);
      return;
    }
  }
  
  const addressesToWhitelist: string[] = rawAddressesToWhitelist;
  
  console.log("📋 Addresses to be added to whitelist:");
  addressesToWhitelist.forEach((addr, index) => {
    console.log(`  ${index + 1}. ${addr}`);
  });
  
  console.log("\n⏳ Adding addresses to whitelist...");
  
  try {
    // Add addresses to whitelist one by one
    for (let i = 0; i < addressesToWhitelist.length; i++) {
      const addr = addressesToWhitelist[i];
      console.log(`  Adding ${addr}...`);
      
      const tx = await token.addToPresaleWhitelist(addr);
      await tx.wait();
      
      console.log(`  ✅ ${addr} added successfully`);
    }
    
    console.log("\n✅ All addresses added to whitelist successfully!");
    
    // Verify that the addresses were added
    console.log("\n🔍 Verifying whitelist status:");
    for (const addr of addressesToWhitelist) {
      const isWhitelisted = await token.isWhitelisted(addr);
      console.log(`  ${addr}: ${isWhitelisted ? '✅ Whitelisted' : '❌ Not Whitelisted'}`);
    }
    
    // You can also use bulkAddToPresaleWhitelist for multiple addresses at once
    console.log("\n💡 Note: You can also use bulkAddToPresaleWhitelist() for adding multiple addresses in a single transaction:");
    console.log("   const tx = await token.bulkAddToPresaleWhitelist([address1, address2, ...]);");
  } catch (error: any) {
    console.error("❌ Error adding addresses to whitelist:", error);
  }
}

// Execute the function
main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
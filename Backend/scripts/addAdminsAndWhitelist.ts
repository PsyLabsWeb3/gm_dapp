import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Adding admin and whitelist addresses to MzcalToken...");

  // Get the deployed contract address from environment variable or command line
  const contractAddress = process.env.MZCAL_CONTRACT_ADDRESS || process.argv[2];

  if (!contractAddress) {
    console.log("❌ Contract address not provided. Usage: npx hardhat run scripts/addAdminsAndWhitelist.ts --network <network> [contract_address]");
    console.log("   Or set MZCAL_CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  // Get the contract instance
  const token = await ethers.getContractAt("MzcalToken", contractAddress);

  // Get addresses from environment variables or command line
  const rawAdminAddresses = process.env.ADMIN_ADDRESSES?.split(',') || [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",  // Default test address
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",  // Default test address
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"   // Default test address
  ];
  const adminAddresses = rawAdminAddresses.map(addr => addr.trim()).filter(addr => addr !== '');

  // Validate admin addresses
  for (const addr of adminAddresses) {
    if (!ethers.isAddress(addr)) {
      console.error(`❌ Invalid admin address: ${addr}`);
      return;
    }
  }

  const rawWhitelistAddresses = process.env.WHITELIST_ADDRESSES?.split(',') || [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",  // Default test address
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",  // Default test address
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"   // Default test address
  ];
  const whitelistAddresses = rawWhitelistAddresses.map(addr => addr.trim()).filter(addr => addr !== '');

  // Validate whitelist addresses
  for (const addr of whitelistAddresses) {
    if (!ethers.isAddress(addr)) {
      console.error(`❌ Invalid whitelist address: ${addr}`);
      return;
    }
  }

  console.log("📋 Admin addresses to be added:");
  adminAddresses.forEach((addr, index) => {
    console.log(`  ${index + 1}. ${addr}`);
  });

  console.log("\n📋 Whitelist addresses to be added:");
  whitelistAddresses.forEach((addr, index) => {
    console.log(`  ${index + 1}. ${addr}`);
  });

  console.log("\n⏳ Adding admin addresses...");
  try {
    // Add addresses as admins one by one
    for (let i = 0; i < adminAddresses.length; i++) {
      const addr = adminAddresses[i];
      console.log(`  Adding ${addr} as admin...`);

      // Check if address is already an admin
      const alreadyAdmin = await token.isAdmin(addr);
      if (alreadyAdmin) {
        console.log(`  ⚠️  ${addr} is already an admin`);
      } else {
        const tx = await token.addAdmin(addr);
        await tx.wait();
        console.log(`  ✅ ${addr} added as admin successfully`);
      }
    }

    console.log("\n⏳ Adding addresses to presale whitelist...");
    // Add addresses to whitelist one by one
    for (let i = 0; i < whitelistAddresses.length; i++) {
      const addr = whitelistAddresses[i];
      console.log(`  Adding ${addr} to whitelist...`);

      const tx = await token.addToPresaleWhitelist(addr);
      await tx.wait();

      console.log(`  ✅ ${addr} added to whitelist successfully`);
    }

    // Also demonstrate bulk addition to whitelist
    console.log("\n⏳ Adding addresses to whitelist using bulk method...");
    const bulkTx = await token.bulkAddToPresaleWhitelist(whitelistAddresses);
    await bulkTx.wait();
    console.log("  ✅ Bulk addition to whitelist completed successfully");

    console.log("\n✅ All admin and whitelist operations completed successfully!");

    // Verify that the addresses were added correctly
    console.log("\n🔍 Verifying admin status:");
    for (const addr of adminAddresses) {
      const isAdmin = await token.isAdmin(addr);
      console.log(`  ${addr}: ${isAdmin ? '✅ Admin' : '❌ Not Admin'}`);
    }

    console.log("\n🔍 Verifying whitelist status:");
    for (const addr of whitelistAddresses) {
      const isWhitelisted = await token.isWhitelisted(addr);
      console.log(`  ${addr}: ${isWhitelisted ? '✅ Whitelisted' : '❌ Not Whitelisted'}`);
    }

  } catch (error: any) {
    console.error("❌ Error adding admin or whitelist addresses:", error);
  }
}

// Execute the function
main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
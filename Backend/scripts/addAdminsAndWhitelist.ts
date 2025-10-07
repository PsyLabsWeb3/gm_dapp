import { ethers } from "hardhat";

async function main() {
  console.log("Adding admin and whitelist addresses to MzcalToken...");

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
    console.log("Usage: npx hardhat run scripts/addAdminsAndWhitelist.ts --network <network> [contract_address]");
    console.log("   Or: npx hardhat run scripts/addAdminsAndWhitelist.ts --network <network> --contract-address <address>");
    console.log("   Or set MZCAL_CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  // Validate the contract address format
  if (!ethers.isAddress(contractAddress)) {
    console.log(`Invalid contract address provided: ${contractAddress}`);
    console.log("Usage: npx hardhat run scripts/addAdminsAndWhitelist.ts --network <network> [contract_address]");
    console.log("   Or: npx hardhat run scripts/addAdminsAndWhitelist.ts --network <network> --contract-address <address>");
    console.log("   Or set MZCAL_CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  // Get the contract instance
  let token;
  try {
    token = await ethers.getContractAt("MzcalToken", contractAddress);
  } catch (error) {
    console.error("Error connecting to contract:", error);
    process.exit(1);
  }

  // Get addresses from environment variables or command line
  const rawAdminAddresses = process.env.ADMIN_ADDRESSES?.split(',') || [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",  // Default test address
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",  // Default test address
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"   // Default test address
  ];
  const adminAddresses = rawAdminAddresses.map(addr => addr.trim()).filter(addr => addr !== '');

  // Validate admin addresses and filter out invalid ones
  const validAdminAddresses: string[] = [];
  for (const addr of adminAddresses) {
    if (ethers.isAddress(addr)) {
      validAdminAddresses.push(addr);
    } else {
      console.error(`Invalid admin address: ${addr}`);
    }
  }

  const rawWhitelistAddresses = process.env.WHITELIST_ADDRESSES?.split(',') || [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",  // Default test address
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",  // Default test address
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"   // Default test address
  ];
  const whitelistAddresses = rawWhitelistAddresses.map(addr => addr.trim()).filter(addr => addr !== '');

  // Validate whitelist addresses and filter out invalid ones
  const validWhitelistAddresses: string[] = [];
  for (const addr of whitelistAddresses) {
    if (ethers.isAddress(addr)) {
      validWhitelistAddresses.push(addr);
    } else {
      console.error(`Invalid whitelist address: ${addr}`);
    }
  }

  console.log("Admin addresses to be added:");
  validAdminAddresses.forEach((addr, index) => {
    console.log(`  ${index + 1}. ${addr}`);
  });

  console.log("\nWhitelist addresses to be added:");
  validWhitelistAddresses.forEach((addr, index) => {
    console.log(`  ${index + 1}. ${addr}`);
  });

  console.log("\nAdding admin addresses...");
  try {
    // Add addresses as admins one by one
    for (let i = 0; i < validAdminAddresses.length; i++) {
      const addr = validAdminAddresses[i];
      console.log(`  Adding ${addr} as admin...`);

      // Check if address is already an admin
      try {
        const alreadyAdmin = await token.isAdmin(addr);
        if (alreadyAdmin) {
          console.log(`  ${addr} is already an admin`);
        } else {
          const tx = await token.addAdmin(addr);
          await tx.wait();
          console.log(` ${addr} added as admin successfully`);
        }
      } catch (error) {
        console.log(` Could not check admin status for ${addr}, adding anyway...`);
        const tx = await token.addAdmin(addr);
        await tx.wait();
        console.log(` ${addr} added as admin (skipping status check)`);
      }
    }

    console.log("\nAdding addresses to presale whitelist...");
    // Add addresses to whitelist one by one
    for (let i = 0; i < validWhitelistAddresses.length; i++) {
      const addr = validWhitelistAddresses[i];
      console.log(`  Adding ${addr} to whitelist...`);

      const tx = await token.addToPresaleWhitelist(addr);
      await tx.wait();

      console.log(`  ${addr} added to whitelist successfully`);
    }

    // Also demonstrate bulk addition to whitelist
    console.log("\nAdding addresses to whitelist using bulk method...");
    if (validWhitelistAddresses.length > 0) {
      const bulkTx = await token.bulkAddToPresaleWhitelist(validWhitelistAddresses);
      await bulkTx.wait();
    }
    console.log("  Bulk addition to whitelist completed successfully");

    console.log("\nAll admin and whitelist operations completed successfully!");

    // Verify that the addresses were added correctly (with error handling)
    console.log("\n Verifying admin status:");
    for (const addr of validAdminAddresses) {
      try {
        const isAdmin = await token.isAdmin(addr);
        console.log(`  ${addr}: ${isAdmin ? 'Admin' : 'Not Admin'}`);
      } catch (error) {
        console.log(`  ${addr}: Could not verify admin status`);
      }
    }

    console.log("\nVerifying whitelist status:");
    for (const addr of validWhitelistAddresses) {
      try {
        const isWhitelisted = await token.isWhitelisted(addr);
        console.log(`  ${addr}: ${isWhitelisted ? 'Whitelisted' : 'Not Whitelisted'}`);
      } catch (error) {
        console.log(`  ${addr}: Could not verify whitelist status`);
      }
    }

  } catch (error: any) {
    console.error("Error adding admin or whitelist addresses:", error);
  }
}

// Execute the function
main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
import { ethers } from "hardhat";

async function main() {
  console.log("Setting token prices for MzcalToken...");

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
    console.log("Usage: npx hardhat run scripts/setTokenPrices.ts --network <network> [contract_address]");
    console.log("   Or: npx hardhat run scripts/setTokenPrices.ts --network <network> --contract-address <address>");
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

  // Get prices from environment variables or use defaults
  const presalePriceEth = process.env.PRESALE_TOKEN_PRICE_ETH || "0.001"; // Default 0.001 ETH
  const mzcalPriceEth = process.env.MZCAL_TOKEN_PRICE_ETH || "0.002";     // Default 0.002 ETH

  // Validate that the price strings are valid numbers before parsing
  const isValidNumber = (str: string): boolean => {
    if (str === undefined || str === null || str === "") return false;
    const num = parseFloat(str);
    return !isNaN(num) && isFinite(num) && num >= 0;
  };

  if (!isValidNumber(presalePriceEth)) {
    console.error(`Invalid presale token price: ${presalePriceEth}`);
    process.exit(1);
  }
  
  if (!isValidNumber(mzcalPriceEth)) {
    console.error(`Invalid MZCAL token price: ${mzcalPriceEth}`);
    process.exit(1);
  }

  // Convert to wei
  let presaleTokenPrice, mzcalTokenPrice;
  try {
    presaleTokenPrice = ethers.parseUnits(presalePriceEth, "ether");
    mzcalTokenPrice = ethers.parseUnits(mzcalPriceEth, "ether");
  } catch (error: any) {
    console.error("Error parsing token prices:", error.message);
    console.log("💡 Make sure prices are valid decimal numbers (e.g., '0.001', '0.1', '10')");
    return;
  }

  console.log("Price settings to be applied:");
  console.log(`  Presale Token Price: ${presalePriceEth} ETH (${presaleTokenPrice.toString()} wei)`);
  console.log(`  MZCAL Token Price: ${mzcalPriceEth} ETH (${mzcalTokenPrice.toString()} wei)`);

  console.log("\nSetting presale token price...");
  try {
    const tx1 = await token.setPresaleTokenPrice(presaleTokenPrice);
    await tx1.wait();
    console.log("  Presale token price set successfully");

    console.log("\n Setting MZCAL token price...");
    const tx2 = await token.setMzcalTokenPrice(mzcalTokenPrice);
    await tx2.wait();
    console.log("  MZCAL token price set successfully");

    console.log("\nAll token prices set successfully!");

    // Verify the prices were set correctly (with error handling)
    console.log("\n Verifying current prices:");
    try {
      const currentPresalePrice = await token.presaleTokenPrice();
      const currentMzcalPrice = await token.mzcalTokenPrice();

      console.log(`  Current Presale Token Price: ${ethers.formatEther(currentPresalePrice)} ETH (${currentPresalePrice.toString()} wei)`);
      console.log(`  Current MZCAL Token Price: ${ethers.formatEther(currentMzcalPrice)} ETH (${currentMzcalPrice.toString()} wei)`);
    } catch (error) {
      console.log("   Could not verify prices after setting");
    }

  } catch (error: any) {
    console.error(" Error setting token prices:", error);
  }
}

// Execute the function
main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(" Script failed:", error);
    process.exit(1);
  });
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Setting token prices for MzcalToken...");

  // Get the deployed contract address from environment variable or command line
  const contractAddress = process.env.MZCAL_CONTRACT_ADDRESS || process.argv[2];

  if (!contractAddress) {
    console.log("❌ Contract address not provided. Usage: npx hardhat run scripts/setTokenPrices.ts --network <network> [contract_address]");
    console.log("   Or set MZCAL_CONTRACT_ADDRESS environment variable");
    return;
  }

  // Get the contract instance
  const token = await ethers.getContractAt("contracts/MzcalToken.sol:MzcalToken", contractAddress);

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
    console.error(`❌ Invalid presale token price: ${presalePriceEth}`);
    return;
  }
  
  if (!isValidNumber(mzcalPriceEth)) {
    console.error(`❌ Invalid MZCAL token price: ${mzcalPriceEth}`);
    return;
  }

  // Convert to wei
  let presaleTokenPrice, mzcalTokenPrice;
  try {
    presaleTokenPrice = ethers.parseUnits(presalePriceEth, "ether");
    mzcalTokenPrice = ethers.parseUnits(mzcalPriceEth, "ether");
  } catch (error: any) {
    console.error("❌ Error parsing token prices:", error.message);
    console.log("💡 Make sure prices are valid decimal numbers (e.g., '0.001', '0.1', '10')");
    return;
  }

  console.log("📋 Price settings to be applied:");
  console.log(`  Presale Token Price: ${presalePriceEth} ETH (${presaleTokenPrice.toString()} wei)`);
  console.log(`  MZCAL Token Price: ${mzcalPriceEth} ETH (${mzcalTokenPrice.toString()} wei)`);

  console.log("\n⏳ Setting presale token price...");
  try {
    const tx1 = await token.setPresaleTokenPrice(presaleTokenPrice);
    await tx1.wait();
    console.log("  ✅ Presale token price set successfully");

    console.log("\n⏳ Setting MZCAL token price...");
    const tx2 = await token.setMzcalTokenPrice(mzcalTokenPrice);
    await tx2.wait();
    console.log("  ✅ MZCAL token price set successfully");

    console.log("\n✅ All token prices set successfully!");

    // Verify the prices were set correctly
    console.log("\n🔍 Verifying current prices:");
    const currentPresalePrice = await token.presaleTokenPrice();
    const currentMzcalPrice = await token.mzcalTokenPrice();

    console.log(`  Current Presale Token Price: ${ethers.formatEther(currentPresalePrice)} ETH (${currentPresalePrice.toString()} wei)`);
    console.log(`  Current MZCAL Token Price: ${ethers.formatEther(currentMzcalPrice)} ETH (${currentMzcalPrice.toString()} wei)`);

  } catch (error: any) {
    console.error("❌ Error setting token prices:", error);
  }
}

// Execute the function
main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
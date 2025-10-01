import { spawn, spawnSync } from "child_process";
import { existsSync } from "fs";

/**
 * Script to run all script tests
 * Usage: npx hardhat run test/scripts/runScriptTests.ts --network localhost
 */

async function runScriptTests() {
  console.log("Starting script tests...\n");

  // Check if hardhat node is running
  const network = process.env.HARDHAT_NETWORK || "localhost";
  console.log(`Testing against network: ${network}`);

  // List of test files to run
  const testFiles = [
    "test/scripts/deploy.test.ts",
    "test/scripts/addAdminsAndWhitelist.test.ts", 
    "test/scripts/addToWhitelist.test.ts",
    "test/scripts/setTokenPrices.test.ts",
    "test/scripts/deployMzcalToken.test.ts"
  ];

  // Check if all test files exist
  const missingFiles = testFiles.filter(file => !existsSync(file));
  if (missingFiles.length > 0) {
    console.error("Missing test files:", missingFiles);
    process.exit(1);
  }

  console.log(`Found ${testFiles.length} test files to run\n`);

  // Run each test individually
  for (const testFile of testFiles) {
    console.log(`Running ${testFile}...`);
    
    try {
      // Execute the test using hardhat
      const result = spawnSync("npx", ["hardhat", "test", testFile], {
        stdio: "inherit",
        cwd: process.cwd(),
        shell: true
      });

      if (result.status === 0) {
        console.log(`${testFile} passed\n`);
      } else {
        console.log(`${testFile} failed\n`);
        // Don't exit immediately, continue with other tests
      }
    } catch (error) {
      console.error(`Error running ${testFile}:`, error);
    }
  }

  console.log("\n Script tests completed!");
}

// Execute the function
runScriptTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script tests failed:", error);
    process.exit(1);
  });
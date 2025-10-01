import { ethers, artifacts } from "hardhat";
import fs from "fs";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Season Token details (assets)
    const tokenIds: number[] = [1];
    const supplies: number[] = [500];
    const prices: number[] = [2]; // (In $MZCAL)

    const MzcalToken = await ethers.getContractFactory("contracts/MzcalToken.sol:MzcalToken");
    const token = await MzcalToken.deploy("http://localhost:8080/tokens/{id}.json");
    await token.waitForDeployment();

    const SeasonalContract = await ethers.getContractFactory("SeasonalContract");
    const season1Contract = await SeasonalContract.deploy("http://localhost:8080/season1/{id}.json", await token.getAddress());
    await season1Contract.waitForDeployment();
    console.log(`Season deployed at: ${await season1Contract.getAddress()}`);

    for (let i = 0; i < tokenIds.length; i++) {
        await season1Contract.mint(deployer.address, tokenIds[i], supplies[i]);
        await season1Contract.setTokenPrice(tokenIds[i], prices[i]);
        console.log(`Token ${tokenIds[i]} initialized: Supply = ${supplies[i]}, Price = ${prices[i]}`);
    }

    // Get the proper ABI from the contract factory
    const contractArtifact = await artifacts.readArtifact("contracts/MzcalToken.sol:MzcalToken");
    const abi = contractArtifact.abi;
    
    // Save to the config directory (the primary location for the ABI)
    if (fs.existsSync("../Frontend/src/config")) {
        fs.writeFileSync("../Frontend/src/config/MzcalTokenABI.json", JSON.stringify(abi, null, 2));
        console.log("✅ ABI saved to ../Frontend/src/config/MzcalTokenABI.json");
    } else {
        console.log("⚠️ Frontend/src/config directory does not exist. Creating it...");
        fs.mkdirSync("../Frontend/src/config", { recursive: true });
        fs.writeFileSync("../Frontend/src/config/MzcalTokenABI.json", JSON.stringify(abi, null, 2));
        console.log("✅ ABI saved to ../Frontend/src/config/MzcalTokenABI.json");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error(error);
        process.exit(1);
    });
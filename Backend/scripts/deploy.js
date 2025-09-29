async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Season Token details (assets)
    const tokenIds = [1];
    const supplies = [500];
    const prices = [2]; // (In $MZCAL)

    const MzcalToken = await ethers.getContractFactory("MzcalToken");
    const token = await MzcalToken.deploy("http://localhost:8080/tokens/{id}.json");
    await token.waitForDeployment();

    const SeasonalContract = await ethers.getContractFactory("SeasonalContract");
    const season1Contract = await SeasonalContract.deploy("http://localhost:8080/season1/{id}.json", token.getAddress());
    await season1Contract.waitForDeployment();
    console.log(`Season deployed at: ${season1Contract.target}`);

    for (let i = 0; i < tokenIds.length; i++) {
        await season1Contract.mint(season1Contract.target, tokenIds[i], supplies[i]);
        await season1Contract.setTokenPrice(tokenIds[i], prices[i]);
        console.log(`Token ${tokenIds[i]} initialized: Supply = ${supplies[i]}, Price = ${prices[i]}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
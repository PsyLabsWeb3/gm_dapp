const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MzcalToken", function () {
    let MzcalToken, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        MzcalToken = await ethers.getContractFactory("MzcalToken");
        token = await MzcalToken.deploy("http://localhost:8080/tokens/{id}.json");
        await token.waitForDeployment();
    });

    it("Should deploy and mint initial supply to the contract", async function () {
        const balance = await token.balanceOf(token.target, 1);
        expect(balance).to.equal(100000);
    });

    it("Should allow the admins to mint new tokens", async function () {
        await token.mint(addr1.address, 1, 500);
        const balance = await token.balanceOf(addr1.address, 1);
        expect(balance).to.equal(500);
    });

    it("Should not allow non-admin to mint tokens", async function () {
        await expect(
            token.connect(addr1).mint(addr2.address, 1, 500)
        ).to.be.revertedWith("Only an admin can execute this");
    });

    it("Should allow users to burn their own tokens", async function () {
        await token.mint(addr1.address, 1, 300);
        await token.connect(addr1).burn(addr1.address, 1, 100);
        const balance = await token.balanceOf(addr1.address, 1);
        expect(balance).to.equal(200);
    });

    it("Should not allow users to burn tokens they do not own", async function () {
        await expect(
            token.connect(addr1).burn(owner.address, 1, 100)
        ).to.be.revertedWith("You can only burn your own tokens");
    });

    it("Should add a single address to the presale whitelist", async function () {
        await token.addToPresaleWhitelist(addr1.address);
        expect(await token.presaleWhitelist(addr1.address)).to.be.true;
    });

    it("Should add multiple addresses to the presale whitelist", async function () {
        const addresses = [addr1.address, addr2.address];
        await token.bulkAddToPresaleWhitelist(addresses);
        expect(await token.presaleWhitelist(addr1.address)).to.be.true;
        expect(await token.presaleWhitelist(addr2.address)).to.be.true;
    });

    it("Should remove multiple addresses from the presale whitelist", async function () {
        const addresses = [addr1.address, addr2.address];
        await token.bulkAddToPresaleWhitelist(addresses);
        await token.bulkRemoveFromPresaleWhitelist(addresses);
        expect(await token.presaleWhitelist(addr1.address)).to.be.false;
        expect(await token.presaleWhitelist(addr2.address)).to.be.false;
    });

    it("Should allow whitelisted users to buy PRESALE_TOKEN", async function () {
        await token.addToPresaleWhitelist(addr1.address);

        const amountToBuy = BigInt(1);
        const price = await token.presaleTokenPrice();

        const initialPresaleBalance = await token.balanceOf(token.target, 2);
        expect(initialPresaleBalance).to.equal(250000);

        await token.connect(addr1).buyPresale(amountToBuy, { value: price * amountToBuy });
        expect(await token.balanceOf(addr1.address, 2)).to.equal(amountToBuy);
    });

    it("Should not allow non-whitelisted users to buy PRESALE_TOKEN", async function () {
        const amountToBuy = BigInt(10);
        await expect(
            token.connect(addr2).buyPresale(amountToBuy)
        ).to.be.revertedWith("Address is not whitelisted");
    });

    it("Should allow the admins to set the MZCAL token price", async function () {
        const newPrice = 10;
        await token.addAdmin(addr1);
        await token.connect(addr1).setMzcalTokenPrice(newPrice);
        expect(await token.mzcalTokenPrice()).to.equal(newPrice);
    });

    it("Should not allow non-admin to set the MZCAL token price", async function () {
        const newPrice = 10;
        await expect(
            token.connect(addr2).setMzcalTokenPrice(newPrice)
        ).to.be.revertedWith("Only an admin can execute this");
    });
});
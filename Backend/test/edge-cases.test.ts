import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MzcalToken Edge Cases", function () {
  this.timeout(50000);

  let token: any;
  let deployer: SignerWithAddress;
  let admin1: SignerWithAddress;
  let admin2: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let notAdmin: SignerWithAddress;

  beforeEach(async function () {
    // Get signers
    [deployer, admin1, admin2, user1, user2, notAdmin] = await ethers.getSigners();

    // Deploy the contract
    const MzcalToken = await ethers.getContractFactory("contracts/MzcalToken.sol:MzcalToken");
    token = await MzcalToken.deploy("https://api.example.com/local/token/{id}.json");
    await token.waitForDeployment();

    // Add admin1 and admin2 as admins
    await token.addAdmin(admin1.address);
    await token.addAdmin(admin2.address);
  });

  describe("Authorization Edge Cases", function () {
    it("Should prevent non-admin from adding admin", async function () {
      await expect(
        token.connect(notAdmin).addAdmin(notAdmin.address)
      ).to.be.revertedWith("Only an admin can execute this");
    });

    it("Should prevent non-admin from removing admin", async function () {
      await expect(
        token.connect(notAdmin).removeAdmin(admin1.address)
      ).to.be.revertedWith("Only an admin can execute this");
    });

    it("Should prevent non-admin from minting tokens", async function () {
      await expect(
        token.connect(notAdmin).mint(user1.address, 1, 100)
      ).to.be.revertedWith("Only an admin can execute this");
    });

    it("Should prevent non-admin from setting token prices", async function () {
      await expect(
        token.connect(notAdmin).setMzcalTokenPrice(ethers.parseUnits("0.001", "ether"))
      ).to.be.revertedWith("Only an admin can execute this");

      await expect(
        token.connect(notAdmin).setPresaleTokenPrice(ethers.parseUnits("0.001", "ether"))
      ).to.be.revertedWith("Only an admin can execute this");
    });

    it("Should prevent non-admin from adding to whitelist", async function () {
      await expect(
        token.connect(notAdmin).addToPresaleWhitelist(user1.address)
      ).to.be.revertedWith("Only an admin can execute this");
    });

    it("Should prevent non-admin from bulk adding to whitelist", async function () {
      await expect(
        token.connect(notAdmin).bulkAddToPresaleWhitelist([user1.address, user2.address])
      ).to.be.revertedWith("Only an admin can execute this");
    });
  });

  describe("Admin Management Edge Cases", function () {
    it("Should prevent adding an address that is already an admin", async function () {
      await expect(
        token.addAdmin(deployer.address)
      ).to.be.revertedWith("Address is already an admin");
    });

    it("Should prevent removing an address that is not an admin", async function () {
      const randomAddress = ethers.Wallet.createRandom().address;
      await expect(
        token.removeAdmin(randomAddress)
      ).to.be.revertedWith("Address is not an admin");
    });

    it("Should allow removing admin when the caller is an admin", async function () {
      // Make admin2 remove admin1
      await token.connect(admin2).removeAdmin(admin1.address);
      expect(await token.isAdmin(admin1.address)).to.be.false;
    });
  });

  describe("Whitelist Edge Cases", function () {
    it("Should prevent non-whitelisted address from buying presale tokens", async function () {
      await expect(
        token.connect(user1).buyPresale(10, { value: ethers.parseUnits("0.01", "ether") })
      ).to.be.revertedWith("Address is not whitelisted");
    });

    it("Should prevent duplicate whitelist additions", async function () {
      // Add user1 to whitelist
      await token.addToPresaleWhitelist(user1.address);
      
      // Try to add user1 again
      await token.addToPresaleWhitelist(user1.address);
      
      // Check that user1 is still whitelisted (should not have an error)
      expect(await token.isWhitelisted(user1.address)).to.be.true;
    });

    it("Should allow adding and removing from whitelist", async function () {
      // Add to whitelist
      await token.addToPresaleWhitelist(user1.address);
      expect(await token.isWhitelisted(user1.address)).to.be.true;
      
      // Remove from whitelist
      await token.removeFromPresaleWhitelist(user1.address);
      expect(await token.isWhitelisted(user1.address)).to.be.false;
      
      // Add back to whitelist
      await token.addToPresaleWhitelist(user1.address);
      expect(await token.isWhitelisted(user1.address)).to.be.true;
    });
  });

  describe("Token Purchase Edge Cases", function () {
    beforeEach(async function () {
      // Add user1 to whitelist
      await token.addToPresaleWhitelist(user1.address);
    });

    it("Should prevent buying presale tokens with incorrect ETH amount", async function () {
      const price = await token.presaleTokenPrice();
      const expectedCost = price * BigInt(10); // 10 tokens
      
      // Send less ETH than required
      await expect(
        token.connect(user1).buyPresale(10, { value: expectedCost - BigInt(1) })
      ).to.be.revertedWith("Incorrect ETH sent");

      // Send more ETH than required
      await expect(
        token.connect(user1).buyPresale(10, { value: expectedCost + BigInt(1) })
      ).to.be.revertedWith("Incorrect ETH sent");
    });

    it("Should prevent buying more presale tokens than available", async function () {
      // Calculate the total presale token supply
      const totalSupply = await token.balanceOf(await token.getAddress(), 2); // PRESALE_TOKEN ID is 2
      
      // Try to buy more than available
      const tokensToBuy = Number(totalSupply) + 1000;
      const pricePerToken = await token.presaleTokenPrice();
      const ethToSend = pricePerToken * BigInt(tokensToBuy);
      
      await expect(
        token.connect(user1).buyPresale(tokensToBuy, { 
          value: ethToSend
        })
      ).to.be.revertedWith("Not enough PRESALE_TOKEN available");
    });

    it("Should prevent claiming MZCAL tokens before launch", async function () {
      await expect(
        token.connect(user1).claimMZCALTokens()
      ).to.be.revertedWith("MZCAL token not launched yet");
    });

    it("Should prevent buying MZCAL tokens before launch", async function () {
      await expect(
        token.connect(user1).buyMZCAL(10, { value: ethers.parseUnits("0.01", "ether") })
      ).to.be.revertedWith("MZCAL token not launched yet");
    });
  });

  describe("Token Price Edge Cases", function () {
    it("Should allow setting extremely low token prices", async function () {
      const veryLowPrice = 1n; // 1 wei
      await token.setMzcalTokenPrice(veryLowPrice);
      expect(await token.mzcalTokenPrice()).to.equal(veryLowPrice);
    });

    it("Should allow setting extremely high token prices", async function () {
      const veryHighPrice = ethers.parseEther("1000000"); // 1 million ETH
      await token.setMzcalTokenPrice(veryHighPrice);
      expect(await token.mzcalTokenPrice()).to.equal(veryHighPrice);
    });

    it("Should handle zero token price", async function () {
      const zeroPrice = 0n;
      await token.setMzcalTokenPrice(zeroPrice);
      expect(await token.mzcalTokenPrice()).to.equal(zeroPrice);
    });
  });

  describe("Token Transfer Edge Cases", function () {
    it("Should prevent unauthorized burning", async function () {
      // Non-admin should only be able to burn their own tokens
      // First mint some tokens to user1 to have something to burn
      await token.mint(user1.address, 1, 100);
      
      // Try to burn from different address (user2) which should fail
      await expect(
        token.connect(user2).burn(user1.address, 1, 50)
      ).to.be.revertedWith("You can only burn your own tokens");
    });

    it("Should prevent self-burning by non-owner", async function () {
      // Try to burn from another user's address (not by the user themselves)
      await token.mint(user1.address, 1, 1000);
      await expect(
        token.connect(user2).burn(user1.address, 1, 500)
      ).to.be.revertedWith("You can only burn your own tokens");
    });
  });

  describe("MZCAL Token Launch Edge Cases", function () {
    beforeEach(async function () {
      // Add user1 to whitelist and let them buy some presale tokens
      await token.addToPresaleWhitelist(user1.address);
      
      // Buy some presale tokens
      const price = await token.presaleTokenPrice();
      await token.connect(user1).buyPresale(50, { value: price * BigInt(50) });
    });

    it("Should prevent claiming MZCAL before launch even with presale tokens", async function () {
      const userBalance = await token.balanceOf(user1.address, 2); // PRESALE_TOKEN ID
      expect(userBalance).to.be.greaterThan(0);
      
      await expect(
        token.connect(user1).claimMZCALTokens()
      ).to.be.revertedWith("MZCAL token not launched yet");
    });

    it("Should allow claiming MZCAL after launch", async function () {
      // Launch the MZCAL token
      await token.launchMZCALToken();
      
      // Check user has presale tokens
      const presaleBalanceBefore = await token.balanceOf(user1.address, 2); // PRESALE_TOKEN ID
      expect(presaleBalanceBefore).to.be.greaterThan(0);
      
      // Claim MZCAL tokens
      await token.connect(user1).claimMZCALTokens();
      
      // Check presale tokens are burned and MZCAL tokens are minted
      const presaleBalanceAfter = await token.balanceOf(user1.address, 2); // PRESALE_TOKEN ID
      expect(presaleBalanceAfter).to.equal(0);
      
      const mzcalBalance = await token.balanceOf(user1.address, 1); // MZCAL ID
      expect(mzcalBalance).to.equal(presaleBalanceBefore);
    });

    it("Should prevent claiming MZCAL twice", async function () {
      // Launch the MZCAL token
      await token.launchMZCALToken();
      
      // First claim should succeed
      await token.connect(user1).claimMZCALTokens();
      
      // Second claim should fail since no presale tokens remain
      await expect(
        token.connect(user1).claimMZCALTokens()
      ).to.be.revertedWith("No PRESALE_TOKEN to convert");
    });
  });

  describe("ETH Payment Edge Cases", function () {
    it("Should refund excess ETH when buying MZCAL tokens", async function () {
      // Launch the MZCAL token
      await token.launchMZCALToken();
      
      // Set a specific price
      const tokenPrice = ethers.parseUnits("0.001", "ether"); // 0.001 ETH per token
      await token.setMzcalTokenPrice(tokenPrice);
      
      // Buy MZCAL tokens with more ETH than needed
      const tokensToBuy = 5;
      const ethToSend = tokenPrice * BigInt(tokensToBuy) + ethers.parseUnits("0.001", "ether"); // Send slightly more
      
      // Check initial balances
      const initialContractBalance = await ethers.provider.getBalance(await token.getAddress());
      const initialUserBalance = await ethers.provider.getBalance(user1.address);
      
      // Perform the purchase
      const tx = await token.connect(user1).buyMZCAL(tokensToBuy, { value: ethToSend });
      await tx.wait();
      
      // Check final balances
      const finalContractBalance = await ethers.provider.getBalance(await token.getAddress());
      const finalUserBalance = await ethers.provider.getBalance(user1.address);
      
      // The contract should have received only the exact amount needed
      expect(finalContractBalance).to.equal(initialContractBalance + (tokenPrice * BigInt(tokensToBuy)));
    });

    it("Should reject insufficient ETH when buying MZCAL tokens", async function () {
      // Launch the MZCAL token
      await token.launchMZCALToken();
      
      // Set a specific price
      const tokenPrice = ethers.parseUnits("0.001", "ether"); // 0.001 ETH per token
      await token.setMzcalTokenPrice(tokenPrice);
      
      // Try to buy with insufficient ETH
      const tokensToBuy = 5;
      const insufficientEth = tokenPrice * BigInt(tokensToBuy) - BigInt(1); // 1 wei less
      
      await expect(
        token.connect(user1).buyMZCAL(tokensToBuy, { value: insufficientEth })
      ).to.be.revertedWith("Insufficient ETH sent");
    });
  });
});
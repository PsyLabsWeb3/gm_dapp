// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MzcalToken.sol";

contract SeasonalContract is ERC1155, Ownable {
    MzcalToken public mzcalToken;

    mapping(uint256 => uint256) public tokenPrices; // Prices for each asset
    mapping(address => BasketItem[]) public userTradeBaskets; // Mapping of users to their baskets
    mapping(uint256 => Trade) public trades; // Mapping of global trade offers
    mapping(uint256 => BasketItem[]) public user1Offers; // Mapping of trade to user1 offers
    mapping(uint256 => BasketItem[]) public user2Offers; // Mapping of trade to user2 offers
    uint256 public tradeCounter;

    // Item for the trade basket
    struct BasketItem {
        address contractAddress;
        uint256 tokenId;
        uint256 amount;
    }

    // Struct to represent a trade
    struct Trade {
        address user1;
        address user2;
        bool user1Approved;
        bool user2Approved;
        uint8 status; // 0: Pending, 1: Executed, 2: Cancelled 
    }

    // Events
    event AssetPurchase(address indexed buyer, uint256 tokenId, uint256 amount, uint256 cost);
    event TradeExecuted(address indexed user1, address indexed user2, uint256 tradeId);

    modifier onlyAdmin() {
        require(mzcalToken.isAdmin(msg.sender));
        _;
    }

    constructor(string memory uri,address payable _mzcalToken) ERC1155(uri) Ownable(msg.sender) {
        mzcalToken = MzcalToken(_mzcalToken);
    }

    function mint(address to, uint256 id, uint256 amount) external onlyAdmin {
        _mint(to, id, amount, "");
    }

    function burn(address from, uint256 id, uint256 amount) external {
        require(from == msg.sender || mzcalToken.isAdmin(msg.sender), "You can only burn your own tokens");
        _burn(from, id, amount);
    }

    function buyAsset(uint256 id, uint256 amount) external {
        // Check total price and ensure price is set
        uint256 totalPrice = tokenPrices[id] * amount;
        require(totalPrice > 0, "Token price not set");

        // Check contract has enough tokens of the asset
        uint256 contractBalance = balanceOf(address(this), id);
        require(contractBalance >= amount, "Not enough assets available");

        // Deduct MZCAL from the player's account (token contract)
        mzcalToken.spendMZCAL(msg.sender, totalPrice);

        // Transfer the asset to the player
        _safeTransferFrom(address(this), msg.sender, id, amount, "");

        emit AssetPurchase(msg.sender, id, amount, totalPrice);
    }

    // Set the price of a specific asset
    function setTokenPrice(uint256 tokenId, uint256 price) external onlyAdmin {
        tokenPrices[tokenId] = price;
    }

    // Withdraw ETH balance to the owner's address
    function withdraw(address payable a70, address payable a30) external onlyAdmin {
        uint256 bal = address(this).balance;
        require(bal > 0);

        uint256 s70 = (bal * 70) / 100;
        a70.transfer(s70);
        a30.transfer(bal - s70);
    }

    // Trade functions

    function createTradeBasket(BasketItem[] calldata items) external {
        delete userTradeBaskets[msg.sender];

        for (uint256 i = 0; i < items.length; i++) {
            // Check if contract address is valid
            require(items[i].contractAddress == address(mzcalToken) || items[i].contractAddress == address(this), "Invalid contract address");

            if (items[i].contractAddress == address(mzcalToken)) {
                // Check if token ID is valid
                require(items[i].tokenId == mzcalToken.MZCAL(), "Invalid token ID");

                // Check user has enough tokens
                uint256 balance = mzcalToken.balanceOf(msg.sender,items[i].tokenId);
                require(balance >= items[i].amount,"Not enough assets available");
            } else {
                // Check if token ID is valid
                require(tokenPrices[items[i].tokenId] > 0, "Invalid token ID");

                // Check user has enough tokens of the asset
                uint256 balance = balanceOf(msg.sender, items[i].tokenId);
                require(balance >= items[i].amount, "Not enough assets available");
            }

            userTradeBaskets[msg.sender].push(items[i]);
        }
    }

    function clearTradeBasket() external {
        delete userTradeBaskets[msg.sender];
    }

    function proposeTrade(address _user2, BasketItem[] calldata _user1Offer, BasketItem[] calldata _user2Offer) external returns (uint256) {
        uint256 tradeId = tradeCounter++;

        trades[tradeId] = Trade({
            user1: msg.sender,
            user2: _user2,
            user1Approved: true,
            user2Approved: false,
            status: 0
        });

        for (uint256 i = 0; i < _user1Offer.length; i++) {
            user1Offers[tradeId].push(_user1Offer[i]);
        }
        
        for (uint256 j = 0; j < _user2Offer.length; j++) {
            user2Offers[tradeId].push(_user2Offer[j]);
        }

        delete userTradeBaskets[msg.sender];
        return tradeId;
    }

    function changeTradeApproval(uint256 tradeId, bool approval) external {
        Trade storage trade = trades[tradeId];
        require(msg.sender == trade.user1 || msg.sender == trade.user2, "User not part of the trade");
        require(trade.status == 0, "Trade executed or cancelled");

        if (msg.sender == trade.user1) {
            trade.user1Approved = approval;
        } else {
            trade.user2Approved = approval;
        }
    }

    function cancelTrade(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        require(msg.sender == trade.user1 || msg.sender == trade.user2, "User not part of the trade");
        require(trade.status == 0, "Trade executed or cancelled");

        trade.status = 2;
    }

    function executeTrade(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        BasketItem[] storage user1Offer = user1Offers[tradeId];
        BasketItem[] storage user2Offer = user2Offers[tradeId];

        // Validate the trade settings
        require(trade.user1Approved && trade.user2Approved, "Trade not approved by both users");
        require(trade.status == 0, "Trade executed or cancelled");

        // ToDo: Approve contract just for this function
        require(IERC1155(address(this)).isApprovedForAll(trade.user1, address(this)), "User 1 must approve contract");
        require(IERC1155(address(this)).isApprovedForAll(trade.user2, address(this)), "User 2 must approve contract");

        // Verify both user's offers
        for (uint256 i = 0; i < user1Offer.length; i++) {
            require(user1Offer[i].contractAddress == address(mzcalToken) || user1Offer[i].contractAddress == address(this), "Invalid contract address");

            if (user1Offer[i].contractAddress == address(mzcalToken)) {
                // Check if token ID is valid
                require(user1Offer[i].tokenId == mzcalToken.MZCAL(), "Invalid token ID");

                // Check user has enough tokens
                uint256 balance = mzcalToken.balanceOf(trade.user1, user1Offer[i].tokenId);
                require(balance >= user1Offer[i].amount, "Not enough assets available");
            } else {
                // Check if token ID is valid
                require(tokenPrices[user1Offer[i].tokenId] > 0, "Invalid token ID");

                // Check user has enough tokens of the asset
                uint256 balance = balanceOf(trade.user1, user1Offer[i].tokenId);
                require(balance >= user1Offer[i].amount, "Not enough assets available");
            }
        }

        for (uint256 j = 0; j < user2Offer.length; j++) {
            require(user2Offer[j].contractAddress == address(mzcalToken) || user2Offer[j].contractAddress == address(this), "Invalid contract address");

            if (user2Offer[j].contractAddress == address(mzcalToken)) {
                // Check if token ID is valid
                require(user2Offer[j].tokenId == mzcalToken.MZCAL(), "Invalid token ID");

                // Check user has enough tokens
                uint256 balance = mzcalToken.balanceOf(trade.user1, user2Offer[j].tokenId);
                require(balance >= user2Offer[j].amount, "Not enough assets available");
            } else {
                // Check if token ID is valid
                require(tokenPrices[user2Offer[j].tokenId] > 0, "Invalid token ID");

                // Check user has enough tokens of the asset
                uint256 balance = balanceOf(trade.user2, user2Offer[j].tokenId);
                require(balance >= user2Offer[j].amount, "Not enough assets available");
            }
        }

        // Execute the trade
        for (uint256 i = 0; i < user1Offer.length; i++) {
            if (user1Offer[i].contractAddress == address(mzcalToken)) {
                mzcalToken.safeTransferFrom(trade.user1, trade.user2, user1Offer[i].tokenId, user1Offer[i].amount, "");
            } else {
                safeTransferFrom(trade.user1, trade.user2, user1Offer[i].tokenId, user1Offer[i].amount, "");
            }
        }

        for (uint256 j = 0; j < user2Offer.length; j++) {
            if (user2Offer[j].contractAddress == address(mzcalToken)) {
                mzcalToken.safeTransferFrom(trade.user2, trade.user1, user2Offer[j].tokenId, user2Offer[j].amount, "");
            } else {
                safeTransferFrom(trade.user2, trade.user1, user2Offer[j].tokenId, user2Offer[j].amount, "");
            }
        }
        
        // Mark the trade as traded
        trade.status = 1;
        emit TradeExecuted(trade.user1, trade.user2, tradeId);
    }

    // Contract functions

    function onERC1155Received(
        address /* operator */,
        address /* from */,
        uint256 /* id */,
        uint256 /* value */,
        bytes calldata /* data */
    ) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address /* operator */,
        address /* from */,
        uint256[] calldata /* ids */,
        uint256[] calldata /* values */,
        bytes calldata /* data */
    ) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    // Handle ETH Donations
    receive() external payable {}
}

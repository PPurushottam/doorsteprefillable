// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Grocery {
    struct Item {
        string name;
        uint256 price;
        bool purchased;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount;

    event ItemAdded(string name, uint256 price);
    event ItemPurchased(uint256 id, string name, uint256 price);

    function addItem(string memory _name, uint256 _price) public {
        itemCount++;
        items[itemCount] = Item(_name, _price, false);
        emit ItemAdded(_name, _price);
    }

    function purchaseItem(uint256 _id) public payable {
        Item storage item = items[_id];
        require(item.price == msg.value, "Incorrect amount sent.");
        require(!item.purchased, "Item already purchased.");

        item.purchased = true;
        emit ItemPurchased(_id, item.name, item.price);
    }
}


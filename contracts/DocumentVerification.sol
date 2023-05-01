// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VendingMachine {
    address payable public owner;
    uint public itemPrice;
    uint public stock;
    
    event ItemPurchased(address buyer);
    event StockUpdated(uint stock);
    
    constructor(uint _itemPrice, uint _initialStock) {
        owner = payable(msg.sender);
        itemPrice = _itemPrice;
        stock = _initialStock;
    }
    
    function buyItem() public payable {
        require(msg.value >= itemPrice, "Insufficient funds.");
        require(stock > 0, "Out of stock.");
        
        owner.transfer(msg.value);
        stock--;
        
        emit ItemPurchased(msg.sender);
    }
    
    function updateStock(uint _newStock) public {
        require(msg.sender == owner, "Unauthorized.");
        
        stock = _newStock;
        
        emit StockUpdated(stock);
    }
    
    function withdrawFunds() public {
        require(msg.sender == owner, "Unauthorized.");
        
        owner.transfer(address(this).balance);
    }
}

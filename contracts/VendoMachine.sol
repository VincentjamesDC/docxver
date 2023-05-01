// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VendoMachine {
    address owner;
    uint256 stock;
    uint256 price;
    mapping(address => uint256) balances;

    constructor() {
        owner = msg.sender;
        stock = 50;
        price = 2 ether;
    }

    function restock(uint256 amount) public {
        require(msg.sender == owner, "Only owner can restock");
        stock += amount;
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(msg.sender).transfer(balance);
    }

    function buy() public payable {
        require(msg.value == price, "Incorrect amount sent");
        require(stock > 0, "Out of stock");
        stock--;
        balances[msg.sender] += msg.value;
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    function getprice() public view  returns (uint256){
        return price;
    }

    function printReceipt() public view returns (string memory) {
        require(balances[msg.sender] > 0, "No purchases made");
        return string(abi.encodePacked("Customer Address: ", toAsciiString(msg.sender), ", Amount Spent: ", uint2str(balances[msg.sender])));
    }

    function toAsciiString(address x) private pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(bytes1 b) private pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function uint2str(uint256 num) private pure returns (string memory) {
        if (num == 0) {
            return "0";
        }
        uint256 j = num;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (num != 0) {
            k = k-1;
            uint8 temp = uint8(48 + uint8(num % 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            num /= 10;
        }
        return string(bstr);
    }
}

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

library MyipfsHash {
    function getHash(string memory _hash) public pure returns (bytes32) {
        bytes memory hashBytes = bytes(_hash);
        uint256 hashLength = hashBytes.length;
        bytes32 hash;

        assembly {
            hash := mload(add(_hash, 32))
        }

        return hash;
    }
}

contract DocumentVerification {
    MyipfsHash public ipfsHash; // declare IPFS hash library variable

    struct Document {
        address owner;
        bytes32 documentHash;
        string ipfsHash;
        uint timestamp;
        bool verified;
    }

    mapping(bytes32 => Document) public documents;

    event DocumentAdded(address owner, bytes32 documentHash, string ipfsHash, uint timestamp);
    event DocumentVerified(bytes32 documentHash);

    constructor(address _ipfsHash) {
        ipfsHash = MyipfsHash(_ipfsHash); // initialize IPFS hash library
    }

    function addDocument(bytes32 _documentHash, string memory _ipfsHash) public {
        require(documents[_documentHash].owner == address(0), "Document already exists");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");

        documents[_documentHash] = Document({
            owner: msg.sender,
            documentHash: _documentHash,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            verified: false
        });

        emit DocumentAdded(msg.sender, _documentHash, _ipfsHash, block.timestamp);
    }

    function verifyDocument(bytes32 _documentHash) public {
        require(documents[_documentHash].owner == msg.sender, "You don't own this document");
        require(!documents[_documentHash].verified, "Document already verified");

        documents[_documentHash].verified = true;

        emit DocumentVerified(_documentHash);
    }

    function getDocument(bytes32 _documentHash) public view returns (address, string memory, uint, bool) {
        Document storage document = documents[_documentHash];
        return (document.owner, document.ipfsHash, document.timestamp, document.verified);
    }

    function getIPFSHash(string memory _hash) public view returns (bytes32) {
        return ipfsHash.getHash(_hash);
    }
}

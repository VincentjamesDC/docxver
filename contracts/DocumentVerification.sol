pragma solidity ^0.8.0;

//import "https://github.com/ethereum/solidity-examples/tree/master/src/ipfs";

contract DocumentVerification {
    struct Document {
        string ipfsHash;
        bool verified;
        address owner;
    }
    
    mapping(bytes32 => Document) public documents;
    
    function addDocument(bytes32 hash, string memory ipfsHash) public {
        require(documents[hash].owner == address(0), "Document already exists");
        
        documents[hash] = Document(ipfsHash, false, msg.sender);
    }
    
    function verifyDocument(bytes32 hash) public {
        require(documents[hash].owner != address(0), "Document does not exist");
        require(msg.sender == documents[hash].owner, "Only document owner can verify");
        
        documents[hash].verified = true;
    }
}

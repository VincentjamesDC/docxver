// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "../node_modules/ipfs-mini/src/index.js";


contract DocumentVerifier {
    string public documentHash;
    IPFS public ipfs;

    constructor() {
        ipfs = new IPFS("ipfs.infura.io", 5001);
    }

    function setDocumentHash(string memory _documentHash) public {
        documentHash = _documentHash;
    }

    function uploadDocument(bytes memory _file) public returns (string memory) {
        (bool success, bytes memory ipfsHash) = address(ipfs).call(abi.encodeWithSignature("add(bytes)", _file));
        require(success, "IPFS upload failed");
        return string(ipfsHash);
    }

    function verifyDocument(string memory _ipfsHash) public view returns (bool) {
        (bool success,) = address(ipfs).call(abi.encodeWithSignature("cat(string)", _ipfsHash));
        return success;
    }
}




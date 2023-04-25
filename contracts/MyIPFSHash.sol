// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

library MyIPFSHash {
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
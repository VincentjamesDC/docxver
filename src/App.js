import React, { useState } from "react";
import Web3 from "web3";
import { create } from "ipfs-http-client";

const ipfs = create("https://ipfs.infura.io:5001/api/v0");

const DocumentVerification = ({ contractAddress, abi }) => {
  const [file, setFile] = useState();
  const [hash, setHash] = useState();
  const [status, setStatus] = useState();

  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(abi, contractAddress);

  const addDocument = async () => {
    const buffer = await file.arrayBuffer();
    const result = await ipfs.add(buffer);
    const ipfsHash = result.path;

    const accounts = await web3.eth.getAccounts();
    const hash = await contract.methods
      .addDocument(web3.utils.soliditySha3(ipfsHash))
      .send({ from: accounts[0] });

    setHash(hash);
  };

  const verifyDocument = async () => {
    const accounts = await web3.eth.getAccounts();
    const hash = await contract.methods
      .verifyDocument(web3.utils.soliditySha3(hash))
      .send({ from: accounts[0] });

    setStatus("Verified");
  };

  return (
    <div>
      <h1>Document Verification</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={addDocument}>Add Document</button>
      {hash && (
        <div>
          <p>Document hash: {hash.transactionHash}</p>
          {!status && (
            <button onClick={verifyDocument}>Verify Document</button>
          )}
          {status && <p>{status}</p>}
        </div>
      )}
    </div>
  );
};

export default DocumentVerification;
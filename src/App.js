import React, { useState } from "react";
import Web3 from "web3";
import DocumentVerifier from "./contracts/DocumentVerifier.json";

const App = () => {
  const [documentHash, setDocumentHash] = useState("");
  const [file, setFile] = useState();
  const [ipfsHash, setIpfsHash] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

  const uploadToIPFS = async () => {
    const IPFS = require("ipfs-mini");
    const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
    ipfs.add(file, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log("IPFS hash:", result);
      setIpfsHash(result);
      setIsUploaded(true);
    });
  };

  const verifyDocument = async () => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = DocumentVerifier.networks[networkId];
    const contract = new web3.eth.Contract(
      DocumentVerifier.abi,
      deployedNetwork && deployedNetwork.address
    );
    const result = await contract.methods.verifyDocument(ipfsHash).call();
    console.log("Document verified:", result);
    setIsVerified(result);
  };

  const onFileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const buffer = Buffer.from(reader.result);
      setDocumentHash(web3.utils.keccak256(buffer));
    };
  };

  return (
    <div>
      <h1>Document Verifier</h1>
      <div>
        <h3>Step 1: Select a file to upload</h3>
        <input type="file" onChange={onFileSelected} />
        {file && (
          <div>
            <p>Selected file: {file.name}</p>
            <p>Document hash: {documentHash}</p>
            <button onClick={uploadToIPFS}>Upload to IPFS</button>
          </div>
        )}
      </div>
      {isUploaded && (
        <div>
          <h3>Step 2: Verify the document</h3>
          <p>IPFS hash: {ipfsHash}</p>
          <button onClick={verifyDocument}>Verify Document</button>
          {isVerified && <p>Document has been verified!</p>}
        </div>
      )}
    </div>
  );
};

export default App;
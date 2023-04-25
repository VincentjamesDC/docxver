import React, { useState } from "react";
import { ethers } from "ethers";
import DocumentVerification from "./contracts/DocumentVerification.json";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [documentHash, setDocumentHash] = useState("");
  const [ipfsHash, setIPFSHash] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // eslint-disable-next-line no-unused-vars
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider
        (window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();
        const contractAddress = DocumentVerification.networks[network.chainId].address;
        const contract = new ethers.Contract(contractAddress, DocumentVerification.abi, signer);
        setProvider(provider);
        setContract(contract);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask to use this application.");
    }
  };

  const addDocument = async () => {
    try {
      const ipfsHashBytes32 = await contract.getIPFSHash(ipfsHash);
      await contract.addDocument(documentHash, ethers.utils.parseBytes32String(ipfsHashBytes32));
      setStatus("Document added to the blockchain.");
    } catch (error) {
      console.error(error);
      setStatus("Error adding document to the blockchain.");
    }
  };

  const verifyDocument = async () => {
    try {
      await contract.verifyDocument(documentHash);
      setStatus("Document verified on the blockchain.");
    } catch (error) {
      console.error(error);
      setStatus("Error verifying document on the blockchain.");
    }
  };

  const getDocument = async () => {
    try {
      const document = await contract.getDocument(documentHash);
      setStatus("");
      alert(
        `Owner: ${document[0]}\nIPFS Hash: ${document[1]}\nTimestamp: ${new Date(
          document[2] * 1000
        ).toLocaleString()}\nVerified: ${document[3]}`
      );
    } catch (error) {
      console.error(error);
      setStatus("Error getting document from the blockchain.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Blockchain-based Document Verification with IPFS</h1>
        <button onClick={connectWallet}>Connect Wallet</button>
        <div>
          <label>Document Hash:</label>
          <input type="text" value={documentHash} onChange={(e) => setDocumentHash(e.target.value)} />
        </div>
        <div>
          <label>IPFS Hash:</label>
          <input type="text" value={ipfsHash} onChange={(e) => setIPFSHash(e.target.value)} />
        </div>
        <button onClick={addDocument}>Add Document</button>
        <button onClick={verifyDocument}>Verify Document</button>
        <button onClick={getDocument}>Get Document</button>
        <div>{status}</div>
      </header>
    </div>
  );
}

export default App;

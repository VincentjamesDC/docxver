import React, { useState } from "react";
import Web3 from "web3";
import VendingMachineContract from "./contracts/VendoMachine.json";

const web3 = new Web3(Web3.givenProvider);

function App() {
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [itemPrice, setItemPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      setAccounts(accounts);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VendingMachineContract.networks[networkId];
      const contract = new web3.eth.Contract(
        VendingMachineContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(contract);
      const itemPrice = await contract.methods.itemPrice().call();
      const stock = await contract.methods.stock().call();
      setItemPrice(itemPrice);
      setStock(stock);
      const balance = await web3.eth.getBalance(contract.options.address);
      setBalance(balance);
    } catch (error) {
      console.error(error);
    }
  };

  const buyItem = async () => {
    try {
      await contract.methods.buyItem().send({
        from: accounts[0],
        value: itemPrice,
      });
      const newStock = await contract.methods.stock().call();
      setStock(newStock);
      setStatus("Item purchased.");
    } catch (error) {
      console.error(error);
      setStatus("Purchase failed.");
    }
  };

  const updateStock = async (event) => {
    event.preventDefault();
    try {
      const newStock = parseInt(event.target.elements[0].value);
      await contract.methods.updateStock(newStock).send({ from: accounts[0] });
      setStock(newStock);
      setStatus("Stock updated.");
    } catch (error) {
      console.error(error);
      setStatus("Update failed.");
    }
  };

  const withdrawFunds = async () => {
    try {
      await contract.methods.withdrawFunds().send({ from: accounts[0] });
      const balance = await web3.eth.getBalance(contract.options.address);
      setBalance(balance);
      setStatus("Funds withdrawn.");
    } catch (error) {
      console.error(error);
      setStatus("Withdrawal failed.");
    }
  };

  return (
    <div>
      <h1>Vending Machine</h1>
      {accounts.length === 0 ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Accounts: {accounts[0]}</p>
          <p>Item Price: {itemPrice} wei</p>
          <p>Stock: {stock}</p>
          <p>Contract Balance: {balance} wei</p>
          <button onClick={buyItem}>Buy Item</button>
          <form onSubmit={updateStock}>
            <label>
              Stock:
              <input type="number" name="stock" />
            </label>
            <button type="submit">Update Stock</button>
          </form>
          <button onClick={withdrawFunds}>Withdraw Funds</button>
          <p>Status: {status}</p>
        </div>
      )}
    </div>
  );
}

export default App;
